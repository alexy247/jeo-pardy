import { useNavigate, useParams } from "react-router-dom";
import { useRef } from "react";
import { useGameStore } from "../store/useGameStore";
import { useCancellableFetch } from "../hoocks/useCancellableFetch";
import { useGame } from "../context/GameContext";

import CenteringBlock from "../components/ui/centering-block/CenteringBlock";

const CreateSession = () => {
    const params = useParams();
    const navigate = useNavigate();
    const { user } = useGame();
    const { createSession } = useGameStore();
    const abortControllerRef = useRef<AbortController>();

    useCancellableFetch(async (signal) => {
        abortControllerRef.current = new AbortController();
        if (params.packId && user) {
            createSession(user, params.packId, signal).then((data) => {
                navigate(`/categories/${data}`);
            })
            .catch((res) => {
                console.log(res);
            });
        }
    }, [user]);

    return (
        <CenteringBlock>Загрузка игры для пака {params.packId} .....</CenteringBlock>
    );
};

export default CreateSession;