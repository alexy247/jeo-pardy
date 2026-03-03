import { useEffect, useRef } from "react";
import { useGameStore } from "../store/useGameStore";
import { useCancellableFetch } from "../hoocks/useCancellableFetch";

import LinkButton from "../components/actions/LinkButton";
import SpaceBetween from "../components/ui/space-between/SpaceBetween";

export const Packs = () => {
    const { packs, isLoading, loadPacks } = useGameStore();
    const abortControllerRef = useRef<AbortController>();

    useCancellableFetch(async (signal) => {
        abortControllerRef.current = new AbortController();
        loadPacks(signal);
    });

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);
        
    if (isLoading) return <div>Loading packs...</div>;

    return (
        <div>
            <SpaceBetween>
                <>
                    <h1>Допустимые паки</h1>
                    <LinkButton to={'createPack'} label="Создать свой"/>
                </>
            </SpaceBetween>
            <ul>
                {packs && packs.map((item) => (
                    <li key={item.id}>
                        <div>
                            {item.name}
                        </div>
                        <div>
                            {item.authorName}
                        </div>
                        <div>
                            {item.created.getTime()}
                        </div>
                        <LinkButton to={`/createSession/${item.id}`} label={"Начать игру"}/>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Packs;