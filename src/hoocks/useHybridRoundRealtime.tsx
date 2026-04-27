import { IRoundChangeResult, SessionId } from "../data/types";
import { supabase } from "../lib/supabase";

export const useHybridRoundRealtime = (currentGameSession: SessionId, currentRoundNumber?: number, handleGameUpdate?: (changeRoundResult: IRoundChangeResult) => void) => {
    const BROADCAST_EVENT = `round-number-change-${currentGameSession}`;
    const UPDATE_CHANNEL = `game-update-round-channel-${currentGameSession}`;

    let lastRoundNumberLet: number | undefined = currentRoundNumber;

    const subscribeOnRoundChange = async () => {
        const channel = supabase.channel(UPDATE_CHANNEL, {
            config: {
                broadcast: { 
                self: false,
                ack: true
                }
            }
        });

        const messageReceived = (payload: any) => {
            if (lastRoundNumberLet != payload.payload.roundNumber) {
                lastRoundNumberLet = payload.payload.roundNumber;
                handleGameUpdate && handleGameUpdate(payload.payload);
            }
        }
    
        channel.on('broadcast',
            { event: BROADCAST_EVENT },
            (payload) => messageReceived(payload)
        ).subscribe();
    };

    const openRoundAbstract  = async (changeRoundResult: IRoundChangeResult): Promise<any> => {
        const channel = supabase.channel(UPDATE_CHANNEL, {
            config: {
            broadcast: { 
                self: false,
                ack: true
                }
            }
        });
    
        return channel
            .send({
                type: 'broadcast',
                event: BROADCAST_EVENT,
                payload: changeRoundResult,
            })
            .catch((error) => console.error('Broadcast failed:', error));
    }

    const openRound  = async (roundNumber: number): Promise<any> => {
        return openRoundAbstract({
            roundNumber: roundNumber,
            openLiderboard: false
        });
    }

    const openLidearboard  = async (): Promise<any> => {
        return openRoundAbstract({
            openLiderboard: true
        });
    }

    return { subscribeOnRoundChange, openRound, openLidearboard };
}