export interface ILoadSupabaseDataParams<T, K> {
    requestKey: string,
    functionName: string,
    argsObj?: object,
    callBackFunc: (data: T) => K,
    externalSignal?: AbortSignal,
}

export interface IStoreWithLoadFromSupabase {
    isLoading: boolean;
    error: string | null;

    activeRequests: Map<string, AbortController>;

    logger: (message: string) => void;

    loadSupabaseData: <T, K>(params: ILoadSupabaseDataParams<T, K>) => Promise<K | undefined>;

    abortRequest: (key: string) => void;
    abortAllRequests: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    
    reset: () => void;
}

