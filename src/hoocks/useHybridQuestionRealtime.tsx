import { supabase } from '../lib/supabase';
import { IQuestionChangeResult, QuestionId, QuestionStatus, SessionId } from '../data/types';

export const useHybridQuestionRealtime = (currentGameSession: SessionId, handleQuestionUpdate?: (questionChangeResult: IQuestionChangeResult) => void) => {
    const BROADCAST_EVENT = `question-status-change-${currentGameSession}`;
    const UPDATE_CHANNEL = `game-update-question-channel-${currentGameSession}`;  

    let lastQuestionLet: QuestionId | undefined = undefined;

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

    const subscribeOnQuestionChange = async () => {
      const channel = supabase.channel(UPDATE_CHANNEL, {
        config: {
          broadcast: { 
            self: false,
            ack: true
            }
          }
      });

      const messageReceived = (payload: any) => {
          if (lastQuestionLet != payload.payload.questionId) {
              lastQuestionLet = payload.payload.questionId;
              handleQuestionUpdate && handleQuestionUpdate(payload.payload);
          }
      }
  
      channel.on('broadcast',
          { event: BROADCAST_EVENT },
          (payload) => messageReceived(payload)
      ).subscribe();
      
    };

  const changeQuestionStatus = async (status: QuestionStatus, questionId: QuestionId, updateDate: string): Promise<any> => {
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
          payload: { questionId: questionId, questionStatus: status },
      })
      .catch((error) => console.error('Broadcast failed, using direct DB update:', error))
      .finally(() => questionStatusBDUpdate(status, questionId, updateDate));
  };

  const disableQuestion = async (questionId: QuestionId): Promise<any> => {
    return changeQuestionStatus('DISABLED', questionId, new Date().toISOString())
  };

  const openQuestion = async (questionId: QuestionId): Promise<any> => {
    return changeQuestionStatus('ACTIVE', questionId, new Date().toISOString())
  };

  const openAnswer = async (questionId: QuestionId): Promise<any> => {
    return changeQuestionStatus('FINISHED', questionId, new Date().toISOString())
  };

  return { subscribeOnQuestionChange, openQuestion, disableQuestion, openAnswer };
};