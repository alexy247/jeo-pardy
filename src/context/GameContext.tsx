import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/auth-js';

export const GameContext = createContext<GameContextType>({});

export const useGame = () => useContext(GameContext);

interface GameContextType {
  user?: User | null;
  signIn?: (email: string, password: string) => Promise<boolean>;
}

export const GameProvider = ({ children }: any) => {
    const [user, setUser] = useState<User | null>(null);

    // Загрузка пользователя
    useEffect(() => {
        // Проверка текущей сессии
        supabase.auth.getSession().then(({ data: { session } }) => {
            return setUser(session?.user ?? null);
        })
    
        // Слушатель изменений авторизации
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            setUser(session?.user ?? null);
            console.log(JSON.stringify(event));
          }
        )
    
        return () => subscription.unsubscribe()
    }, []);
      
    const signIn = async (email: string, password: string): Promise<boolean> => {
        return await supabase.auth.signInWithPassword({ email, password })
            .then(res => {
                console.log(JSON.stringify(res));
                setUser(res.data.user);
                return Promise.resolve(true);
            })
            // TODO: show error
            .catch(err => Promise.reject(err));
    }

    return (
        <GameContext.Provider value={{ user, signIn}}>
            {children}
        </GameContext.Provider>
    )
}

export default GameProvider;