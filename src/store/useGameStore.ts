import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/auth-js';
import { IBoardRound, IPack, IRound, SessionId } from '../data/types';
import { convertSQLResultToPacks } from '../data/packsConverter';
import { convertSQLResultToRounds } from '../data/roundsConverter';
import { convertSQLResultToSessionId } from '../data/sessionConverter';
import { convertSQLResultToBoardRound } from '../data/boardRoundConverter';

interface GameStore {
    packs: IPack[];
    currentGameSession: SessionId;
    currentSessionRounds: IRound[];
    currentRound: number;
    boardRound: IBoardRound;
    isLoading: boolean;
    error: string | null;

    activeRequests: Map<string, AbortController>;

    loadPacks: (signal?: AbortSignal) => Promise<IPack[] | undefined>;
    loadRounds: (sessionId: SessionId, signal?: AbortSignal) => Promise<IRound[] | undefined>;
    loadCurrentRound: (user: User, signal?: AbortSignal) => Promise<IBoardRound | undefined>;

    createSession: (user: User, packId: string, signal?: AbortSignal) => Promise<SessionId | undefined>;

    abortRequest: (key: string) => void;
    abortAllRequests: () => void;

    nextRound: () => void;
    setRound: (value: number) => void;
    setGameSession: (value: string) => void;

    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
    // Начальное состояние
    packs: [],
    currentGameSession: '',
    currentSessionRounds: [],
    currentRound: 0,
    boardRound: { roundName: "", categoriesNames: [], rows: new Map()},
    isLoading: false,
    error: null,

    activeRequests: new Map(),

    abortRequest: (key: string) => {
        const controller = get().activeRequests.get(key);
        if (controller) {
            controller.abort();
            get().activeRequests.delete(key);
        }
    },

    abortAllRequests: () => {
        get().activeRequests.forEach(controller => controller.abort());
        get().activeRequests.clear();
    },

    loadPacks: async (externalSignal) => {
        const requestKey = 'loadPacks:public';
        // Отменяем предыдущий запрос
        get().abortRequest(requestKey);

        const abortController = new AbortController();
        get().activeRequests.set(requestKey, abortController);

        const signal = externalSignal
            ? AbortSignal.any([abortController.signal, externalSignal])
            : abortController.signal;

        set({ isLoading: true, error: null });
        try {
            if (signal.aborted) {
                throw new DOMException('Aborted', 'AbortError');
            }

            let query = supabase
                .from('packs')
                .select(
                    `
                    id,
                    name,
                    created_at,
                    ...users!inner(
                    username
                    )
                    `,
                );

            const { data, error } = await query.abortSignal(signal);

            if (error) throw error;

            if (signal.aborted) return;

            const packsConverted = convertSQLResultToPacks(data);

            set({ packs: packsConverted || [] });

            return packsConverted;
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                console.log('Request cancelled:', requestKey);
                return;
            }
            set({ error: error instanceof Error ? error.message : 'Failed to fetch packs' });
        } finally {
            get().activeRequests.delete(requestKey);
            set({ isLoading: false });
        }
    },

    loadRounds: async (sessionId, externalSignal) => {
         if (get().currentGameSession != sessionId) {
                set({ currentGameSession: sessionId });
            }

        const requestKey = `loadRounds:${sessionId}`;
        // Отменяем предыдущий запрос
        get().abortRequest(requestKey);

        const abortController = new AbortController();
        get().activeRequests.set(requestKey, abortController);

        const signal = externalSignal
            ? AbortSignal.any([abortController.signal, externalSignal])
            : abortController.signal;

        set({ isLoading: true, error: null });
        try {
            if (signal.aborted) {
                throw new DOMException('Aborted', 'AbortError');
            }

            let query = supabase
                .from('packs')
                .select(
                    `
                ...game_sessions!inner(),
                ...game_rounds_question!inner(
                ...questions!inner(
                    ...categories!inner(
                    id,
                    categories_name:name
                    )
                ),
                ...game_rounds!inner(
                    round_order_num,
                    ...rounds!inner(
                    rounds_name:name
                    )
                )
                )
                `,
                )
                .eq(
                    'game_sessions.id',
                    sessionId,
                );
            // TODO: Не работает
            // .order('game_rounds(round_order_num)');


            const { data, error } = await query.abortSignal(signal);

            if (error) {
                return Promise.reject(`error ${error.message}`);
            };

            if (signal.aborted) return;

            const currentCategoriesConverted = convertSQLResultToRounds(data[0]);
            set({ currentSessionRounds: currentCategoriesConverted || [] });

            return currentCategoriesConverted;
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                console.log('Request cancelled:', requestKey);
                return;
            }
            set({ error: error instanceof Error ? error.message : 'Failed to fetch packs' });
        } finally {
            get().activeRequests.delete(requestKey);
            set({ isLoading: false });
        }
    },

    loadCurrentRound: async (user, externalSignal) => {
        const currentRound = get().currentRound;
        const currentGameSession = get().currentGameSession;

        const requestKey = `loadCurrentRound:${currentRound}:${currentGameSession}`;
        // Отменяем предыдущий запрос
        get().abortRequest(requestKey);

        const abortController = new AbortController();
        get().activeRequests.set(requestKey, abortController);

        const signal = externalSignal
            ? AbortSignal.any([abortController.signal, externalSignal])
            : abortController.signal;
        set({ isLoading: true, error: null });
        try {
            if (signal.aborted) {
                throw new DOMException('Aborted', 'AbortError');
            }

            if (!user) {
                return Promise.reject('No user');
            }

            if (!currentGameSession) {
                return Promise.reject('No currentGameSession');
            }
            let query = supabase.rpc('load_current_round', { sessionid: currentGameSession , userid: user.id, round_order: currentRound });

            const { data, error } = await query.abortSignal(signal);
            

            if (error) {
                return Promise.reject(`error ${error.message}`);
            };

            console.log(data);

            if (signal.aborted) return;

            const boardRoundConverted = convertSQLResultToBoardRound(data);

            set({ boardRound: boardRoundConverted || [] });

            return boardRoundConverted;
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                console.log('Request cancelled:', requestKey);
                return;
            }
            set({ error: error instanceof Error ? error.message : 'Failed to fetch packs' });
        } finally {
            get().activeRequests.delete(requestKey);
            set({ isLoading: false });
        }
    },

    createSession: async (user, packId, externalSignal) => {
        const requestKey = `createSession:${packId}`;
        // Отменяем предыдущий запрос
        get().abortRequest(requestKey);

        const abortController = new AbortController();
        get().activeRequests.set(requestKey, abortController);

        const signal = externalSignal
            ? AbortSignal.any([abortController.signal, externalSignal])
            : abortController.signal;

        set({ isLoading: true, error: null });
        try {
            if (signal.aborted) {
                throw new DOMException('Aborted', 'AbortError');
            }
            if (!user) {
                return Promise.reject('No user');
            }
            let query = supabase
                .from('game_sessions')
                .insert({
                    user_id: user.id,
                    pack_id: packId
                })
                .select()
                .eq('user_id', user.id)
                .eq('pack_id', packId);

            const { data, error } = await query.abortSignal(signal);

            if (error) {
                return Promise.reject(`error ${error.message}`);
            };

            if (signal.aborted) return;

            const currentGameSessionConverted = convertSQLResultToSessionId(data[0]);
            set({ currentGameSession: currentGameSessionConverted });
            return currentGameSessionConverted;
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                console.log('Request cancelled:', requestKey);
                return;
            }
            set({ error: error instanceof Error ? error.message : 'Failed to fetch packs' });
        } finally {
            get().activeRequests.delete(requestKey);
            set({ isLoading: false });
        }
    },

    nextRound: () => { set({currentRound: get().currentRound + 1}) },

    setRound: (value: number) => { set({currentRound: value}) },
    setGameSession: (value: string) => { set({currentGameSession: value}) },

    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error })
}));