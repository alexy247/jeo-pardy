import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useHybridRoundRealtime } from "../../hoocks/useHybridRoundRealtime";

import CenteringHorizontal from "../ui/centering-horizontal-block/CenteringHorizontal";
import LinkButton from "../actions/LinkButton";
import ButtonType from "../actions/ButtonType";
import { SessionId } from "../../data/types";

interface ITableActions {
    currentGameSession: SessionId;
    currentRound: number;
    roundsCount?: number;
    allQuestionsFinished: boolean;
    nextRound: () => void;
}

const TableActions = memo(({ currentGameSession, currentRound, roundsCount, allQuestionsFinished, nextRound }: ITableActions) => {
    const navigate = useNavigate();
    const [boardFinished, setBoardFinished] = useState<boolean>(false);

    const { openRound } = useHybridRoundRealtime(currentGameSession);

    useEffect(() => {
        setBoardFinished(allQuestionsFinished);
    }, [allQuestionsFinished]);

    const gameFinished = useMemo(() => {
        if (!roundsCount) return false;
        return currentRound + 1 === roundsCount && boardFinished;
    }, [currentRound, roundsCount, boardFinished]);

    const onButtonClick = useCallback(async () => {
        try {
            const nextRoundValue = currentRound + 1;

            nextRound();

            await openRound(nextRoundValue);

            navigate(`/board/${currentGameSession}/${nextRoundValue}`);
        } catch(error) {
            console.error(`Error opening next round: ${error}`);
        }
    }, [currentRound, nextRound, openRound, currentGameSession, navigate]);

    // Если доска не завершена, ничего не рендерим
    if (!boardFinished) {
        return null;
    }

    return (
        <CenteringHorizontal isBottom>
            {gameFinished
                ? <LinkButton to={`/board/${currentGameSession}/leaderboard`} title={"Итоги"} label={"Итоги"} />
                : <ButtonType label="Следующий раунд" type="button" onClick={onButtonClick}/>
            }
        </CenteringHorizontal>
    );
});

export default TableActions;