import { useRef, useState } from "react";
import { IRound } from "../data/types";
import { useGameStore } from "../store/useGameStore";
import { useCancellableFetch } from "../hoocks/useCancellableFetch";
import { useParams } from "react-router-dom";

import LinkButton from "../components/actions/LinkButton";
import SlidingBlock from "../components/ui/sliding-block/SlidingBlock";
import UlList from "../components/ui/ul-list/UlList";
import ListItem from "../components/ui/ul-list/list-item/ListItem";
import CenteringHorizontal from "../components/ui/centering-horizontal-block/CenteringHorizontal";

function Categories() {
    const params = useParams();
    const [currentGameRounds, setCurrentGameRounds] = useState<IRound[]>();
    const { loadRounds, isLoading } = useGameStore();
    const abortControllerRef = useRef<AbortController>();

    useCancellableFetch(async (signal) => {
        abortControllerRef.current = new AbortController();
        if (params.sessionId) {
            loadRounds(params.sessionId, signal)
                .then((data) => {
                    setCurrentGameRounds(data);
                })
                .catch(() => {
                    // TODO: добавить страницу с ошибкой
                });
            }
    });

    if (isLoading) return <div>Loading categories...</div>;
    
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
            <LinkButton to={'/board'} label="К таблице"/>
        </CenteringHorizontal>
    );
}

export default Categories;