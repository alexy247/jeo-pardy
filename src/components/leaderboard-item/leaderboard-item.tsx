import { IPlayerWithScore } from "../../data/types";

import './leaderboard-item.css';

interface ILeaderboardItemProps {
    index: number;
    player: IPlayerWithScore;
}

function LeaderboardItem({ index, player }: ILeaderboardItemProps) {
    return (
        <div className="leaderboard-item">
            <div className="leaderboard-item_place">
                {index + 1}
            </div>
            <div className="leaderboard-item_avatar">
                <img className="player-img" alt={player.email} src={player.avatarUrl} />
            </div>
            <div className="leaderboard-item_name">
                {player.username || player.email}
            </div>
            <div className="leaderboard-item_score">
                {player.score}
            </div>
        </div>
    );
};

export default LeaderboardItem;