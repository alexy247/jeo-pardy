import { useRef, useState } from "react";
import { IRound } from "../data/types";
import { useGameStore } from "../store/useGameStore";
import { useCancellableFetch } from "../hoocks/useCancellableFetch";
import { useParams } from "react-router-dom";

import LinkButton from "../components/actions/LinkButton";

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
        <div>
            <h1>Список категорий:</h1>
            <ul>
                {currentGameRounds && currentGameRounds.map((round) => (
                    <li key={round.roundName}>
                      {round.roundName}
                      <ul>
                        {round.categories.map((category) => (
                            <li key={category.id}>
                                {category.title}
                            </li>
                        ))}
                      </ul>
                    </li>
                ))}
            </ul>
            <LinkButton to={'/board'} label="К таблице"/>
        </div>
    );
}

export default Categories;