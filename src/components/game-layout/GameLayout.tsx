import { Fragment } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';

import DebugInfo from '../debug/DebugInfo';
import CenteringBlock from '../ui/centering-block/CenteringBlock';

function GameLayout() {
    const params = useParams();
    const { currentGameSession, setGameSession, error } = useGameStore();

    if (error) {
        return (
            <CenteringBlock>
                {JSON.stringify(error)}
            </CenteringBlock>
        );
    }

    if (params.sessionId && params.sessionId != currentGameSession) {
        console.log('Сессия в сторе отличается от сессии в ссылке');
        setGameSession(params.sessionId);
    }

    return (
        <Fragment>
            <DebugInfo />
            <Outlet />
        </Fragment>
    );
}

export default GameLayout;