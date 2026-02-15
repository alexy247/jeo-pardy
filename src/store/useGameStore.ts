import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/auth-js';
import { IPack, IRound, SessionId } from '../data/types';
import { convertSQLResultToPacks } from '../data/packsConverter';
import { convertSQLResultToRounds } from '../data/roundsConverter';
import { convertSQLResultToSessionId } from '../data/sessionConverter';

interface GameStore {
    packs: IPack[];
    currentGameSession: SessionId;
    currentRounds: IRound[];
    isLoading: boolean;
    error: string | null;

    activeRequests: Map<string, AbortController>;

    loadPacks: (signal?: AbortSignal) => Promise<IPack[] | undefined>;
    loadRounds: (sessionId: SessionId, signal?: AbortSignal) => Promise<IRound[] | undefined>;

    createSession: (user: User, packId: string, signal?: AbortSignal) => Promise<SessionId | undefined>;

    abortRequest: (key: string) => void;
    abortAllRequests: () => void;

    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
    // Начальное состояние
    packs: [],
    currentGameSession: '',
    currentRounds: [],
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

            set({ currentRounds: currentCategoriesConverted || [] });

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

    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error })
}));