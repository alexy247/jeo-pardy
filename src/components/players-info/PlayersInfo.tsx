import { IPlayer } from "../../data/types";

import './PlayersInfo.css';

interface IPlayerItemProps {
    player: IPlayer;
}

const PlayerItem = ({ player }: IPlayerItemProps) => {
    return (
        <div className="player" title={player.username || player.email}>
            <img className="player-img" alt={player.email} src={player.avatarUrl} />
        </div>
    );
}

interface IPlayersListProps {
    playersList: IPlayer[];
}

const PlayersList = ({ playersList }: IPlayersListProps) => {
    return (
        <ul className="players-list">
            {playersList.map((player) => (
                <li key={player.email} className="players-list-item">
                    <PlayerItem player={player} />
                </li>
            ))}
        </ul>
    );
}

interface IPlayersInfoProps {
    players?: IPlayer[]; 
}

function PlayersInfo({ players }: IPlayersInfoProps) {
    return players && <PlayersList playersList={players} />;

}

export default PlayersInfo;