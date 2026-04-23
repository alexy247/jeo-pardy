import { useRef, useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { useCancellableFetch } from '../../hoocks/useCancellableFetch';
import { useGame } from '../../context/GameContext';

import './GameScore.css';

function GameScore() {
    const { loadScore, currentScore } = useGameStore();
    const { user } = useGame();
    const [score, setScore] = useState<number>();

    const abortControllerRef = useRef<AbortController>();
    
    useCancellableFetch(async (signal) => {
        abortControllerRef.current = new AbortController();
        if (user && score != currentScore) {
            console.log('Загружаем скор');
            loadScore(user, signal)
                .then(res => setScore(res));
        }
    }, [user, currentScore]);

    return (
        <div className="game-score">
            Счет: <span className="game-score-number">{score}</span>
        </div>
    );
}

export default GameScore;