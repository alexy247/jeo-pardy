import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/auth-js';
// import { RealtimeChannel } from '@supabase/supabase-js';
import { IAnswer, IBoardRound, IPack, IQuestion, IRound, SessionId } from '../data/types';
import { convertSQLResultToPacks } from '../data/packsConverter';
import { convertSQLResultToRounds } from '../data/roundsConverter';
import { convertSQLResultToSessionId } from '../data/sessionConverter';
import { convertSQLResultToBoardRound } from '../data/boardRoundConverter';
import { convertSQLResultToQuestion } from '../data/questionConverter';
import { convertSQLResultToAnswer } from '../data/answerConverter';
// import { questionChangeSQLResultConverter } from '../data/questionEventChangeConverter';

interface GameStore {
    packs: IPack[];
    currentGameSession: SessionId;
    currentSessionRounds: IRound[];
    currentRound: number;
    boardRound?: IBoardRound;
    currentQuestion?: IQuestion;
    currentAnswer?: IAnswer;
    isLoading: boolean;
    error: string | null;

    activeRequests: Map<string, AbortController>;

    loadPacks: (signal?: AbortSignal) => Promise<IPack[] | undefined>;
    loadRounds: (signal?: AbortSignal) => Promise<IRound[] | undefined>;
    loadCurrentRound: (signal?: AbortSignal) => Promise<IBoardRound | undefined>;
    loadQuestion: (questionId: string, signal?: AbortSignal) => Promise<IQuestion | undefined>;
    loadAnswer: (questionId: string, signal?: AbortSignal) => Promise<IAnswer | undefined>;

    createSession: (user: User, packId: string, signal?: AbortSignal) => Promise<SessionId | undefined>;

    abortRequest: (key: string) => void;
    abortAllRequests: () => void;

    loadSupabaseData: <T, K>(params: ILoadSupabaseDataParams<T, K>) => Promise<K | undefined>;

    nextRound: () => void;
    setRound: (value: number) => void;
    setGameSession: (value: string) => void;
    setCurrentQuestion: (value: IQuestion) => void;

    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

interface ILoadSupabaseDataParams<T, K> {
    requestKey: string,
    functionName: string,
    argsObj?: object,
    callBackFunc: (data: T) => K,
    externalSignal?: AbortSignal,
}

export const useGameStore = create<GameStore>((set, get) => ({
    // Начальное состояние
    packs: [],
    currentGameSession: '',
    currentSessionRounds: [],
    currentRound: 0,
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
        return get().loadSupabaseData<any, IPack[]>({
            requestKey: 'loadPacks:public',
            functionName: 'load_enabled_packs',
            callBackFunc: (data) => {
                const packsConverted = convertSQLResultToPacks(data);
                set({ packs: packsConverted || [] });

                return packsConverted;
            },
            externalSignal: externalSignal,
        });
    },

    loadRounds: async (externalSignal) => {
        const currentGameSession = get().currentGameSession;

        return get().loadSupabaseData<any, IRound[]>({
            requestKey: `loadRounds:${currentGameSession}`,
            functionName: 'load_game_session_rounds',
            argsObj:  { sessionid: currentGameSession },
            callBackFunc: (data) => {
                const currentCategoriesConverted = convertSQLResultToRounds(data);
                set({ currentSessionRounds: currentCategoriesConverted || [] });

                return currentCategoriesConverted;
            },
            externalSignal: externalSignal,
        });
    },

    loadCurrentRound: async (externalSignal) => {
        const currentRound = get().currentRound;
        const currentGameSession = get().currentGameSession;

        return get().loadSupabaseData<any, IBoardRound>({
            requestKey: `loadCurrentRound:${currentRound}:${currentGameSession}`,
            functionName: 'load_current_round',
            argsObj:  { sessionid: currentGameSession , roundorder: currentRound },
            callBackFunc: (data) => {
                const boardRoundConverted = convertSQLResultToBoardRound(data);

                set({ boardRound: boardRoundConverted || [] });

                return boardRoundConverted;
            },
            externalSignal: externalSignal,
        });
    },

    loadQuestion: async (questionId, externalSignal) => {
        const currentGameSession = get().currentGameSession;

        return get().loadSupabaseData<any, IQuestion | undefined>({
            requestKey: `loadQuestion:${questionId}:${currentGameSession}`,
            functionName: 'load_question',
            argsObj:  { sessionid: currentGameSession, questionid: questionId },
            callBackFunc: (data) => {
                const questionConverted = convertSQLResultToQuestion(data[0]);
                set({ currentQuestion: questionConverted });

                return questionConverted;
            },
            externalSignal: externalSignal,
        });
    },

    loadAnswer: async (questionId, externalSignal) => {
        const currentGameSession = get().currentGameSession;

        return get().loadSupabaseData<any, IAnswer | undefined>({
            requestKey: `loadAnswer:${questionId}:${currentGameSession}`,
            functionName: 'load_answer',
            argsObj:  { sessionid: currentGameSession, questionid: questionId },
            callBackFunc: (data) => {
                const answerConverted = convertSQLResultToAnswer(data);
                set({ currentAnswer: answerConverted });

                return answerConverted;
            },
            externalSignal: externalSignal,
        });
    },

    createSession: async (user, packId, externalSignal) => {
        return get().loadSupabaseData<any, SessionId>({
            requestKey: `createSession:${packId}`,
            functionName: 'create_session',
            argsObj: { authorid: user.id , packid: packId},
            callBackFunc: (data) => {
                const currentGameSessionConverted = convertSQLResultToSessionId(data[0]);
                set({ currentGameSession: currentGameSessionConverted });
                
                return currentGameSessionConverted;
            },
            externalSignal: externalSignal,
        });
    },

    loadSupabaseData: async <T, K>({ requestKey, callBackFunc, functionName, argsObj, externalSignal}: ILoadSupabaseDataParams<T, K>): Promise<K | undefined> => {
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
    
            let query = supabase.rpc(functionName, argsObj);
    
            const { data, error } = await query.abortSignal(signal);
    
            if (signal.aborted) return;

            if (error) {
                const errorMsg = `Error while load supabase data, msg: ${error.message}`;
                set({ error: errorMsg });
                return Promise.reject(errorMsg);
            };
    
            return callBackFunc(data);
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                console.log('Request cancelled:', requestKey);
                return;
            }
            set({ error: error instanceof Error ? error.message : `Failed to fetch ${requestKey}` });
        } finally {
            get().activeRequests.delete(requestKey);
            set({ isLoading: false });
        }
    },

    nextRound: () => { set({currentRound: get().currentRound + 1}) },

    setRound: (value: number) => { set({currentRound: value}) },
    setGameSession: (value: string) => { set({currentGameSession: value}) },
    setCurrentQuestion: (value: IQuestion) => { set({ currentQuestion: value}) },

    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error })
}));