import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCancellableFetch } from "../../hoocks/useCancellableFetch";
import { useGameStore } from "../../store/useGameStore";

import CenteringHorizontal from "../ui/centering-horizontal-block/CenteringHorizontal";
import LinkButton from "../actions/LinkButton";
import ButtonType from "../actions/ButtonType";

function TableActions() {
    const navigate = useNavigate();
    const [boardFinished, setBoardFinished] = useState<boolean>(false);
    const [gameFinished, setGameFinished] = useState<boolean>(false);
    const [roundsCount, setRoundsCount] = useState<number>();
    const { currentBoard, currentRound, currentGameSession, nextRound, loadRounds, currentSessionNumberOfRounds } = useGameStore();

    const rows = currentBoard?.rows;

    const abortControllerRef = useRef<AbortController>();

    useCancellableFetch(async (signal) => {
        abortControllerRef.current = new AbortController();
        if (currentSessionNumberOfRounds == undefined) {
            console.log('Мы не знаем сколько раундов будет в игре, подгружаем');
            loadRounds(signal)
                .then((data) => {
                    setRoundsCount(data?.length);
                })
        } else {
            setRoundsCount(currentSessionNumberOfRounds);
        }
    }, [currentSessionNumberOfRounds, currentRound]);

    useEffect(() => {
        let extrasCount = 0;
        for (let row in rows) {
            extrasCount += rows.get(row)!.filter(item => item.questionStatus == 'FINISHED').length;
        }
        setBoardFinished(extrasCount == 0);
    }, [rows]);

    useEffect(() => {
        if (currentRound + 1 == roundsCount) {
            setGameFinished(boardFinished);
        }
    }, [currentRound, roundsCount, boardFinished]);


    const onButtonClick = () => {
        nextRound();
        const nextRoundValue = currentRound + 1;
        navigate(`/board/${currentGameSession}/${nextRoundValue}`);
    };

    return boardFinished && 
        <CenteringHorizontal isBottom>
            {gameFinished
                ? <LinkButton to={`/board/${currentGameSession}/leaderboard`} title={"Итоги"} label={"Итоги"} />
                : <ButtonType label="Следующий раунд" type="button" onClick={onButtonClick}/>
            }
        </CenteringHorizontal>;
}

export default TableActions;