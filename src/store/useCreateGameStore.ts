import { supabase } from '../lib/supabase';
import { CategoryId, ICategory, INewBoard, PackId } from "../data/types";
import { User } from '@supabase/auth-js';
import { ILoadSupabaseDataParams, IStoreWithLoadFromSupabase } from "./storeTypes";
import { create } from "zustand";
import { sendLog } from "../lib/logger";
import { convertSQLResultCreatePackToData } from '../data/createPackConverter';
import { convertSQLResultToNewGameRound } from '../data/newGameRoundConverter';
import { convertSQLResultToNewCategory } from '../data/newCategoryConverter';
import { MediaType } from '../interfaces/MediaObject';

const defaultPriceListByRoundId = { 1: [100, 200, 300, 400, 500] , 2: [200, 400, 600, 800, 1000]};

interface CreateGameStore extends IStoreWithLoadFromSupabase {
    currentPackId: PackId | undefined;
    currentRoundId: number | undefined;

    currentRoundOrderNum: number;
    priceListByRoundId: any | undefined;

    currentBoard?: INewBoard;

    createPack: (user: User, name: string, signal?: AbortSignal) => Promise<PackId | undefined>;
    savePack: (user: User, packId: PackId, signal?: AbortSignal) => Promise<boolean | undefined>;

    loadNewGameRound: (packId: PackId, user: User, roundId: number, signal?: AbortSignal) => Promise<INewBoard | undefined>;
    createCategory: (name: string, signal?: AbortSignal) => Promise<ICategory | undefined>;
    deleteCategory: (categoryId: string, signal?: AbortSignal) => Promise<boolean | undefined>;

    createQuestion: (categoryId: CategoryId, price: number, packId: PackId, roundId: number, questionText: string, questionMediaType: MediaType, questionMediaUrl: string, answerText: string, answerMediaType: MediaType, answerMediaUrl: string, signal?: AbortSignal) => Promise<boolean | undefined>;
    getPricesByRoundId: (roundId: number) => number[];
}

const initialState = {
    currentPackId: undefined,
    currentRoundId: undefined,

    // Пока мы не загружаем из БД
    currentRoundOrderNum: 0,
    // Пока мы не загружаем из БД
    priceListByRoundId: defaultPriceListByRoundId,

    isLoading: false,
    error: null,

    activeRequests: new Map(),
}

export const useCreateGameStore = create<CreateGameStore>((set, get) => ({
    // Начальное состояние
    ...initialState,

    logger: (message) => sendLog({
        level: 'debug',
        userId: 'anonym',
        sessionId: '',
        component: 'useCreateGameStore',
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

    createPack: async (user, name, externalSignal) => {
        return get().loadSupabaseData<any, PackId | undefined>({
            requestKey: `createPack:${name}`,
            functionName: 'create_pack',
            argsObj:  { authorid: user.id, packname: name },
            callBackFunc: (data) => {
                const packsConverted = convertSQLResultCreatePackToData(data);
                set({ currentPackId: packsConverted.packId || undefined, currentRoundId: packsConverted.roundId });

                return packsConverted.packId;
            },
            externalSignal: externalSignal,
        });
    },

    savePack: async (user, packId, externalSignal) => {
        return get().loadSupabaseData<any, boolean | undefined>({
            requestKey: `createPack:${name}`,
            functionName: 'save_pack',
            argsObj:  { authorid: user.id, packid: packId },
            callBackFunc: () => {
                return true;
            },
            externalSignal: externalSignal,
        });
    },

    loadNewGameRound: async (packId, user, roundId, externalSignal) => {
        return get().loadSupabaseData<any, INewBoard | undefined>({
            requestKey: `loadNewGameRound:${name}`,
            functionName: 'load_new_game_round',
            argsObj:  { packid: packId, userid: user.id, roundid: roundId},
            callBackFunc: (data) => {
                const boardConverted = convertSQLResultToNewGameRound(data);
                set({ currentBoard: boardConverted || undefined });

                return boardConverted;
            },
            externalSignal: externalSignal,
        });
    },

    createCategory: async (name, externalSignal) => {
        return get().loadSupabaseData<any, ICategory | undefined>({
            requestKey: `createCategory:${name}`,
            functionName: 'create_new_category',
            argsObj:  { categoryname: name},
            callBackFunc: (data) => {
                return convertSQLResultToNewCategory(data);
            },
            externalSignal: externalSignal,
        });
    },

    deleteCategory: async (categoryId, externalSignal) => {
        return get().loadSupabaseData<any, boolean | undefined>({
            requestKey: `deleteCategory:${categoryId}`,
            functionName: 'delete_category',
            argsObj:  { categoryid: categoryId},
            callBackFunc: () => {
                return true;
            },
            externalSignal: externalSignal,
        });
    },
    
    createQuestion: async (categoryId, price, packId, roundId, questionText, questionMediaType, questionMediaUrl, answerText, answerMediaType, answerMediaUrl, externalSignal) => {
        return get().loadSupabaseData<any, boolean | undefined>({
            requestKey: `createQuestion:${categoryId}`,
            functionName: 'create_new_question',
            argsObj:  { categoryid: categoryId, price: price, packid: packId, roundid: roundId, questiontext: questionText, questionmediatype: questionMediaType, questionmediaurl: questionMediaUrl, answertext: answerText, answermediatype: answerMediaType, answermediaurl: answerMediaUrl },
            callBackFunc: () => {
                return true;
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

    getPricesByRoundId: (roundId: number) => get().priceListByRoundId[roundId],

    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),

    reset: () => set(initialState),
}));