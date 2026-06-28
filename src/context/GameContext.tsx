import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/auth-js';
import { isDevMode } from '../lib/enviromentUtils';

export const GameContext = createContext<GameContextType>({
    isAuthenticated: false,
});

export const useGame = () => useContext(GameContext);

interface GameContextType {
  user?: User | null;
  isAuthenticated: boolean;
  signIn?: (email: string, password: string) => Promise<boolean>;
  signUp?: (email: string, password: string, userName: string) => Promise<boolean>;
}

export const GameProvider = ({ children }: any) => {
    const [user, setUserContext] = useState<User | null>(null);

    // Загрузка пользователя
    useEffect(() => {
        // Проверка текущей сессии
        supabase.auth.getSession().then(({ data: { session } }) => {
            isDevMode && console.log(JSON.stringify(session));
            return setUserContext(session?.user ?? null);
        })
    
        // Слушатель изменений авторизации
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            setUserContext(session?.user ?? null);
            isDevMode && console.log(JSON.stringify(event));
          }
        )
    
        return () => subscription.unsubscribe()
    }, []);
      
    const signIn = useCallback(async (email: string, password: string): Promise<boolean> => {
        return await supabase.auth.signInWithPassword({ email, password })
            .then(res => {
                if (res.error) {
                    return Promise.reject(res.error);
                }
                setUserContext(res.data.user);
                return Promise.resolve(true);
            })
            // TODO: show error
            .catch(err => Promise.reject(err));
    }, []);

    const signUp = useCallback(async (email: string, password: string, userName: string): Promise<boolean> => {
        return await supabase.auth.signUp({ email, password, options: { data: { userName: userName } } })
            .then(res => {
                if (res.error) {
                    return Promise.reject(res.error);
                }
                setUserContext(res.data.user);
                return Promise.resolve(true);
            })
            // TODO: show error
            .catch(err => {
                return  Promise.reject(err);
            });
    }, []);

    const contextValue = useMemo(() => ({
        user,
        isAuthenticated: !!user,
        signIn,
        signUp
    }), [user, signIn, signUp]);


    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    )
}

export default GameProvider;