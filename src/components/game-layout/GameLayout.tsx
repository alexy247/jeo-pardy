import { Fragment, useCallback, useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';

import DebugInfo from '../debug/DebugInfo';
import CenteringBlock from '../ui/centering-block/CenteringBlock';
import { IQuestionChangeResult } from '../../data/types';
import { useHybridQuestionRealtime } from '../../hoocks/useHybridQuestionRealtime';

function GameLayout() {
    const params = useParams();
    const { currentGameSession, setGameSession, currentRound, error } = useGameStore();
    const navigate = useNavigate();

    if (error) {
        return (
            <CenteringBlock>
                {error}
            </CenteringBlock>
        );
    }

    if (params.sessionId && params.sessionId != currentGameSession) {
        console.log('Сессия в сторе отличается от сессии в ссылке');
        setGameSession(params.sessionId);
    }

    const handleQuestionUpdate = useCallback((questionChangeResult: IQuestionChangeResult) => {
        switch (questionChangeResult.questionStatus) {
            case "ACTIVE":
                navigate(`/board/${currentGameSession}/${currentRound}/question/${questionChangeResult.questionId}`);
                break;
            case "FINISHED":
                navigate(`/board/${currentGameSession}/${currentRound}/question/${questionChangeResult.questionId}/answer`);
                break;
            case "INITIAL":
            default:
                navigate(`/board/${currentGameSession}/${currentRound}/`);
                break;
        }
    }, [currentGameSession, currentRound]);

    const { subscribeOnChange } = useHybridQuestionRealtime(currentGameSession, handleQuestionUpdate);
    
    useEffect(() => {
        subscribeOnChange();
    }, [currentGameSession, currentRound, subscribeOnChange]);

    return (
        <Fragment>
            <DebugInfo />
            <Outlet />
        </Fragment>
    );
}

export default GameLayout;