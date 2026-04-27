import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/auth-js';
import { IAnswer, IBoard, IPack, IPlayer, IPlayerWithScore, IQuestion, IRound, QuestionStatus, SessionId } from '../data/types';
import { convertSQLResultToPacks } from '../data/packsConverter';
import { convertSQLResultToRounds } from '../data/roundsConverter';
import { convertSQLResultToSessionId } from '../data/sessionConverter';
import { convertSQLResultToBoardRound } from '../data/boardRoundConverter';
import { convertSQLResultToQuestion } from '../data/questionConverter';
import { convertSQLResultToAnswer } from '../data/answerConverter';
import { convertSQLResultToPlayers } from '../data/playersConverter';
import { convertSQLResultToScore } from '../data/scoreConverter';
import { sendLog } from '../lib/logger';
import { convertSQLResultToPlayersWithScore } from '../data/playersWithScoreConverter';

interface GameStore {
    packs: IPack[];
    
    currentGameSession: SessionId;
    currentSessionRounds: IRound[];
    currentSessionNumberOfRounds: number | undefined;
    currentRound: number;
    currentBoard?: IBoard;
    currentQuestion?: IQuestion;
    currentQuestionStatus?: QuestionStatus;
    currentAnswer?: IAnswer;
    currentScore: number;

    currentGameSessionPlayers: IPlayer[] | undefined;
    currentLeaderboard: IPlayerWithScore[] | undefined;

    isLoading: boolean;
    error: string | null;

    activeRequests: Map<string, AbortController>;

    logger: (message: string) => void;

    loadPacks: (signal?: AbortSignal) => Promise<IPack[] | undefined>;
    loadRounds: (signal?: AbortSignal) => Promise<IRound[] | undefined>;
    loadCurrentRound: (user: User, signal?: AbortSignal) => Promise<IBoard | undefined>;
    loadQuestion: (questionId: string, signal?: AbortSignal) => Promise<IQuestion | undefined>;
    loadAnswer: (questionId: string, signal?: AbortSignal) => Promise<IAnswer | undefined>;

    loadPlayers: (signal?: AbortSignal) => Promise<IPlayer[] | undefined>;
    loadScore: (user: User, signal?: AbortSignal) => Promise<number | undefined>;
    updateScore: (user: User, success: boolean, signal?: AbortSignal) => Promise<number | undefined>;

    loadPlayersWithScore: (signal?: AbortSignal) => Promise<IPlayerWithScore[] | undefined>;

    createSession: (user: User, packId: string, signal?: AbortSignal) => Promise<SessionId | undefined>;

    abortRequest: (key: string) => void;
    abortAllRequests: () => void;

    loadSupabaseData: <T, K>(params: ILoadSupabaseDataParams<T, K>) => Promise<K | undefined>;

    nextRound: () => void;
    setRound: (value: number) => void;
    setGameSession: (value: string) => void;
    setCurrentQuestion: (value: IQuestion) => void;
    setCurrentQuestionStatus: (value: QuestionStatus) => void;

    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    
    reset: () => void;
}

interface ILoadSupabaseDataParams<T, K> {
    requestKey: string,
    functionName: string,
    argsObj?: object,
    callBackFunc: (data: T) => K,
    externalSignal?: AbortSignal,
}

const initialState = {
    packs: [],
    currentGameSession: '',
    currentSessionRounds: [],
    currentSessionNumberOfRounds: undefined,
    currentRound: 0,
    currentScore: 0,
    currentGameSessionPlayers: undefined,
    currentLeaderboard: undefined,
    isLoading: false,
    error: null,

    activeRequests: new Map(),
};

export const useGameStore = create<GameStore>((set, get) => ({
    // Начальное состояние
    ...initialState,

    logger: (message) => sendLog({
        level: 'debug',
        userId: 'anonym',
        sessionId: get().currentGameSession,
        component: 'useGameStore',
        message: message
    }),

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
                set({ currentSessionNumberOfRounds: currentCategoriesConverted.length });

                return currentCategoriesConverted;
            },
            externalSignal: externalSignal,
        });
    },

    loadCurrentRound: async (user, externalSignal) => {
        const currentRound = get().currentRound;
        const currentGameSession = get().currentGameSession;

        return get().loadSupabaseData<any, IBoard>({
            requestKey: `loadCurrentRound:${currentRound}:${currentGameSession}`,
            functionName: 'load_current_round',
            argsObj:  { sessionid: currentGameSession, userid: user.id, roundorder: currentRound },
            callBackFunc: (data) => {
                const boardRoundConverted = convertSQLResultToBoardRound(data);

                set({ currentBoard: boardRoundConverted || [] });

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

    loadPlayers: async (externalSignal) => {
        const currentGameSession = get().currentGameSession;

        return get().loadSupabaseData<any, IPlayer[] | undefined>({
            requestKey: `loadPlayers:${currentGameSession}`,
            functionName: 'load_players',
            argsObj:  { sessionid: currentGameSession },
            callBackFunc: (data) => {
                const playersConverted = convertSQLResultToPlayers(data);
                set({ currentGameSessionPlayers: playersConverted });

                return playersConverted;
            },
            externalSignal: externalSignal,
        });
    },

    loadScore: async (user, externalSignal) => {
        const currentGameSession = get().currentGameSession;

        return get().loadSupabaseData<any, number | undefined>({
            requestKey: `loadScore:${user.id}:${currentGameSession}`,
            functionName: 'load_score',
            argsObj:  { sessionid: currentGameSession, userid: user.id },
            callBackFunc: (data) => {
                const scoreConverted = convertSQLResultToScore(data);
                set({ currentScore: scoreConverted });

                return scoreConverted;
            },
            externalSignal: externalSignal,
        });
    },

    updateScore: async (user, success, externalSignal) => {
        const currentGameSession = get().currentGameSession;
        const currentQuestion = get().currentQuestion;
        const price: number | undefined = success ? currentQuestion?.price : (-1) * currentQuestion?.price!;

        return get().loadSupabaseData<any, number | undefined>({
            requestKey: `updateScore:${user.id}:${currentGameSession}`,
            functionName: 'update_score',
            argsObj:  { sessionid: currentGameSession, userid: user.id, value: price || 0},
            callBackFunc: (data) => {
                const scoreConverted = convertSQLResultToScore(data);
                set({ currentScore: scoreConverted });

                return scoreConverted;
            },
            externalSignal: externalSignal,
        });
    },

    loadPlayersWithScore: async (externalSignal) => {
        const currentGameSession = get().currentGameSession;

        return get().loadSupabaseData<any, IPlayerWithScore[] | undefined>({
            requestKey: `loadPlayersWithScore:${currentGameSession}`,
            functionName: 'load_players_with_score',
            argsObj:  { sessionid: currentGameSession },
            callBackFunc: (data) => {
                const playersConverted = convertSQLResultToPlayersWithScore(data);
                set({ currentLeaderboard: playersConverted });

                return playersConverted;
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
                get().logger(error.message);
                return Promise.reject(errorMsg);
            };
    
            return callBackFunc(data);
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                get().logger(`Request cancelled: ${requestKey}`);
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
    setCurrentQuestionStatus: (value: QuestionStatus) => { set({ currentQuestionStatus: value}) },

    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),

    reset: () => set(initialState),
}));