import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useHybridRoundRealtime } from "../../hoocks/useHybridRoundRealtime";

import CenteringHorizontal from "../ui/centering-horizontal-block/CenteringHorizontal";
import LinkButton from "../actions/LinkButton";
import ButtonType from "../actions/ButtonType";
import { IBoardRow, SessionId } from "../../data/types";

interface ITableActions {
    currentGameSession: SessionId;
    currentRound: number;
    roundsCount?: number;
    rows?: IBoardRow;
    nextRound: () => void;
}

function TableActions({ currentGameSession, currentRound, roundsCount, rows, nextRound }: ITableActions) {
    const navigate = useNavigate();
    const [boardFinished, setBoardFinished] = useState<boolean>(false);
    const [gameFinished, setGameFinished] = useState<boolean>(false);

    const { openRound } = useHybridRoundRealtime(currentGameSession);

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


    const onButtonClick = async () => {
        nextRound();
        const nextRoundValue = currentRound + 1;
        await openRound(nextRoundValue)
            .finally(() => {
                navigate(`/board/${currentGameSession}/${nextRoundValue}`)
            });
    };

    return boardFinished && 
        <CenteringHorizontal isBottom>
            {gameFinished
                ? <LinkButton to={`/board/${currentGameSession}/leaderboard`} title={"Итоги"} label={"Итоги"} />
                : <ButtonType label="Следующий раунд" type="button" onClick={() => onButtonClick()}/>
            }
        </CenteringHorizontal>;
}

export default TableActions;