import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGameStore } from "../store/useGameStore";
import { useCancellableFetch } from "../hoocks/useCancellableFetch";
import { IPlayerWithScore } from "../data/types";

import CenteringHorizontal from "../components/ui/centering-horizontal-block/CenteringHorizontal";
import SlidingBlock from "../components/ui/sliding-block/SlidingBlock";
import ListItem from "../components/ui/ul-list/list-item/ListItem";
import UlList from "../components/ui/ul-list/UlList";
import ButtonType from "../components/actions/ButtonType";
import LeaderboardItem from "../components/leaderboard-item/leaderboard-item";

function Leaderboard() {
    const navigate = useNavigate();
    const { currentGameSession, loadPlayersWithScore, reset } = useGameStore();
    const [leaderboard, setLeaderboard] = useState<IPlayerWithScore[]>();

    const abortControllerRef = useRef<AbortController>();

    useCancellableFetch(async (signal) => {
        abortControllerRef.current = new AbortController();
        loadPlayersWithScore(signal)
            .then((data) => {
                setLeaderboard(data);
            });
    }, [currentGameSession]);

    const onButtonClick = () => {
        reset();
        navigate(`/packs`);
    };

    return (
        <CenteringHorizontal>
            <h1>Победители:</h1>
            <SlidingBlock>
                <UlList>
                    {leaderboard && leaderboard.map((player, index) => (
                        <ListItem key={player.email}>
                            <LeaderboardItem index={index} player={player}/>
                        </ListItem>
                    ))}
                </UlList>
            </SlidingBlock>
            <ButtonType label="Начать другую игру" type="button" onClick={onButtonClick}/>
        </CenteringHorizontal>
    );
}

export default Leaderboard;