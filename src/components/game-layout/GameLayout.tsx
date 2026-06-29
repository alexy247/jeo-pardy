import { Fragment, useCallback, useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { useGameStore } from '../../store/useGameStore';
import { IQuestionChangeResult, IRoundChangeResult } from '../../data/types';
import { useHybridQuestionRealtime } from '../../hoocks/useHybridQuestionRealtime';

import DebugInfo from '../debug/DebugInfo';
import CenteringBlock from '../ui/centering-block/CenteringBlock';
import PlayersInfo from '../players-info/PlayersInfo';
import GameScore from '../game-scrore/GameScore';
import SpaceBetween from '../ui/space-between/SpaceBetween';
import { useHybridRoundRealtime } from '../../hoocks/useHybridRoundRealtime';
import GameName from '../game-name/GameName';

function GameLayout() {
    const params = useParams();
    const { currentUserId, currentGameSession, currentGameSessionName, setGameSession, currentRound, currentQuestion, currentAnswer, setCurrentQuestionStatus, currentGameSessionPlayers, currentScore, error } = useGameStore();
    const navigate = useNavigate();

    if (error) {
        return (
            <CenteringBlock>
                {error}
            </CenteringBlock>
        );
    }

    const checkStoreData = (): void => {
        if (params.sessionId && params.sessionId != currentGameSession) {
            console.log('Сессия в сторе отличается от сессии в ссылке');
            setGameSession(params.sessionId);
        }
    };

    useEffect(() => {
        checkStoreData();
    }, [checkStoreData]);

    const handleQuestionUpdate = useCallback((questionChangeResult: IQuestionChangeResult) => {
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

    const { subscribeOnQuestionChange } = useHybridQuestionRealtime(currentGameSession, handleQuestionUpdate);
    
    useEffect(() => {
        subscribeOnQuestionChange();
    }, [currentGameSession, currentRound, subscribeOnQuestionChange]);

    const handleGameUpdate = useCallback((changeRoundResult: IRoundChangeResult) => {
        if (changeRoundResult.openLiderboard) {
            navigate(`/board/${currentGameSession}/leaderboard/`);
        } else {
            navigate(`/board/${currentGameSession}/${changeRoundResult.roundNumber}/`);
        }
    }, [currentGameSession, currentRound]);

    const { subscribeOnRoundChange } = useHybridRoundRealtime(currentGameSession, currentRound, handleGameUpdate);

    useEffect(() => {
        subscribeOnRoundChange();
    }, [currentGameSession, currentRound, subscribeOnRoundChange]);

    return (
        <Fragment>
            <DebugInfo currentUserId={currentUserId} currentGameSession={currentGameSession} currentRound={currentRound} currentQuestion={currentQuestion} currentAnswer={currentAnswer} />
            <SpaceBetween>
                <PlayersInfo players={currentGameSessionPlayers} />
                <GameName name={currentGameSessionName} />
                <GameScore score={currentScore}/>
            </SpaceBetween>
            <Outlet />
        </Fragment>
    );
}

export default GameLayout;