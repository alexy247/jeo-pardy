import { useRef, useState } from "react";
import { IPlayer } from "../../data/types";
import { useGameStore } from "../../store/useGameStore";

import './PlayersInfo.css';
import { useCancellableFetch } from "../../hoocks/useCancellableFetch";


interface IPlayerItemProps {
    player: IPlayer;
}
interface IPlayersInfoProps {
    playersList: IPlayer[];
}

const PlayerItem = ({ player }: IPlayerItemProps) => {
    return (
        <div className="player" title={player.username || player.email}>
            <img className="player-img" alt={player.email} src={player.avatarUrl} />
        </div>
    );
}

const PlayersList = ({ playersList }: IPlayersInfoProps) => {
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

function PlayersInfo() {
    const { loadPlayers } = useGameStore();
    const [players, setPlayers] = useState<IPlayer[]>();

    const abortControllerRef = useRef<AbortController>();
    
    useCancellableFetch(async (signal) => {
        abortControllerRef.current = new AbortController();
        loadPlayers(signal)
            .then(res => setPlayers(res))
            .catch(() => {
                // TODO: добавить страницу с ошибкой
            });
    }, [loadPlayers]);

    return (
            <>
                {players && <PlayersList playersList={players} />}
            </>
    );

}

export default PlayersInfo;