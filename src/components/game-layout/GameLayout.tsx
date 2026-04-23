import { Fragment, useCallback, useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { useGameStore } from '../../store/useGameStore';
import { IQuestionChangeResult } from '../../data/types';
import { useHybridQuestionRealtime } from '../../hoocks/useHybridQuestionRealtime';

import DebugInfo from '../debug/DebugInfo';
import CenteringBlock from '../ui/centering-block/CenteringBlock';
import PlayersInfo from '../players-info/PlayersInfo';
import GameScore from '../game-scrore/GameScore';
import SpaceBetween from '../ui/space-between/SpaceBetween';

function GameLayout() {
    const params = useParams();
    const { currentGameSession, setGameSession, currentRound, setCurrentQuestionStatus, error } = useGameStore();
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
        console.log(`handleQuestionUpdate status: ${questionChangeResult.questionStatus}`);
        switch (questionChangeResult.questionStatus) {
            case "ACTIVE":
                setCurrentQuestionStatus("ACTIVE");
                navigate(`/board/${currentGameSession}/${currentRound}/question/${questionChangeResult.questionId}`);
                break;
            case "FINISHED":
                setCurrentQuestionStatus("FINISHED");
                navigate(`/board/${currentGameSession}/${currentRound}/question/${questionChangeResult.questionId}/answer`);
                break;
            case "DISABLED":
                setCurrentQuestionStatus("DISABLED");
                break;
            case "INITIAL":
            default:
                setCurrentQuestionStatus("INITIAL");
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
            <SpaceBetween>
                <PlayersInfo />
                <GameScore />
            </SpaceBetween>
            <Outlet />
        </Fragment>
    );
}

export default GameLayout;