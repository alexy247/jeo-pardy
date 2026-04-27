import './GameScore.css';

interface IGameScoreProps {
    score: number;
}

function GameScore({ score }: IGameScoreProps) {
    return (
        <div className="game-score">
            Счет: <span className="game-score-number">{score}</span>
        </div>
    );
}

export default GameScore;