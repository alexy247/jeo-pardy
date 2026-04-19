import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { IQuestionChangeResult, QuestionId, QuestionStatus, SessionId } from '../data/types';

const BROADCAST_EVENT = 'question-status-change';
const UPDATE_CHANNEL = 'game-update-question-channel';

export const useHybridQuestionRealtime = (currentGameSession: SessionId, handleQuestionUpdate?: (question: IQuestionChangeResult) => void) => {
    const [lastQuestion, setLastQuestion] = useState<QuestionId>();

    const questionStatusBDUpdate = async (status: QuestionStatus, questionId: QuestionId, updateDate: string) => {
      await supabase
        .from('game_sessions_questions')
        .update({ 
          question_status: status,
          updated_at: updateDate
        })
        .eq('game_session_id', currentGameSession)
        .eq('question_id', questionId);
    };

    const subscribeOnChange = async () => {
      const channel = supabase.channel(UPDATE_CHANNEL, {
        config: {
          broadcast: { 
            self: false,
            ack: true
            }
          }
      });

      const messageReceived = (payload: any) => {
          if (lastQuestion != payload.payload.questionId) {
              setLastQuestion(payload.payload.questionId);
              handleQuestionUpdate && handleQuestionUpdate(payload.payload);
          }
      }
  
      channel.on('broadcast',
          { event: BROADCAST_EVENT },
          (payload) => messageReceived(payload)
      ).subscribe();
      
    };

  const openQuestion = async (questionId: QuestionId): Promise<any> => {
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
            payload: { questionId: questionId, questionStatus: 'ACTIVE'},
        })
        .catch((error) => console.error('Broadcast failed, using direct DB update:', error))
        .finally(() => questionStatusBDUpdate('ACTIVE', questionId, new Date().toISOString()));
  };

  const openAnswer = async (questionId: QuestionId): Promise<any> => {
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
          payload: { questionId: questionId, questionStatus: 'FINISHED' },
      })
      .catch((error) => console.error('Broadcast failed, using direct DB update:', error))
      .finally(() => questionStatusBDUpdate('FINISHED', questionId, new Date().toISOString()));
  };

  return { subscribeOnChange, openQuestion, openAnswer };
};