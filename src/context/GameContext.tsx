import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/auth-js';

export const GameContext = createContext<GameContextType>({});

export const useGame = () => useContext(GameContext);

interface GameContextType {
  user?: User | null;
  // TODO:
  signIn?: (email: string, password: string) => Promise<boolean>;
}

export const GameProvider = ({ children }: any) => {
    const [user, setUserContext] = useState<User | null>(null);

    // Загрузка пользователя
    useEffect(() => {
        // Проверка текущей сессии
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log(JSON.stringify(session));
            return setUserContext(session?.user ?? null);
        })
    
        // Слушатель изменений авторизации
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            setUserContext(session?.user ?? null);
            console.log(JSON.stringify(event));
          }
        )
    
        return () => subscription.unsubscribe()
    }, []);
      
    const signIn = useCallback(async (email: string, password: string): Promise<boolean> => {
        return await supabase.auth.signInWithPassword({ email, password })
            .then(res => {
                console.log(JSON.stringify(res));
                setUserContext(res.data.user);
                return Promise.resolve(true);
            })
            // TODO: show error
            .catch(err => Promise.reject(err));
    }, []);

    const contextValue = useMemo(() => ({
        user,
        signIn
    }), [user, signIn]);


    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    )
}

export default GameProvider;