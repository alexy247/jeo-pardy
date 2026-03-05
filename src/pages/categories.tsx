import { useRef, useState } from "react";
import { IRound } from "../data/types";
import { useGameStore } from "../store/useGameStore";
import { useCancellableFetch } from "../hoocks/useCancellableFetch";

import LinkButton from "../components/actions/LinkButton";
import SlidingBlock from "../components/ui/sliding-block/SlidingBlock";
import UlList from "../components/ui/ul-list/UlList";
import ListItem from "../components/ui/ul-list/list-item/ListItem";
import CenteringHorizontal from "../components/ui/centering-horizontal-block/CenteringHorizontal";

function Categories() {
    const [currentGameRounds, setCurrentGameRounds] = useState<IRound[]>();
    const { loadRounds, currentGameSession } = useGameStore();
    const abortControllerRef = useRef<AbortController>();

    useCancellableFetch(async (signal) => {
        abortControllerRef.current = new AbortController();
        loadRounds(signal)
            .then((data) => {
                setCurrentGameRounds(data);
            })
            .catch(() => {
                // TODO: добавить страницу с ошибкой
            });
    }, [currentGameSession]);

    return (
        <CenteringHorizontal>
            <h1>Список категорий:</h1>
            <SlidingBlock>
                <UlList>
                    {currentGameRounds && currentGameRounds.map((round) => (
                        <ListItem key={round.roundName}>
                            {round.roundName}
                            <UlList>
                                {round.categories.map((category) => (
                                    <ListItem key={category.id}>
                                        {category.title}
                                    </ListItem>
                                ))}
                            </UlList>
                        </ListItem>
                    ))}
                </UlList>
            </SlidingBlock>
            <LinkButton to={`/board/${currentGameSession}/${0}`} label="К таблице"/>
        </CenteringHorizontal>
    );
}

export default Categories;