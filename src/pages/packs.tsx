import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/useGameStore";
import { useCancellableFetch } from "../hoocks/useCancellableFetch";
import { IPack } from "../data/types";

import LinkButton from "../components/actions/LinkButton";
import SpaceBetween from "../components/ui/space-between/SpaceBetween";
import ListItem from "../components/ui/ul-list/list-item/ListItem";
import UlList from "../components/ui/ul-list/UlList";

const Packs = () => {
    const { isLoading, loadPacks } = useGameStore();
    const [ packs, setPacks] = useState<IPack[]>();

    const abortControllerRef = useRef<AbortController>();

    useCancellableFetch(async (signal) => {
        abortControllerRef.current = new AbortController();
        loadPacks(signal)
            .then(data => {
                setPacks(data);
            })
            .catch(() => {
                // TODO: добавить страницу с ошибкой
            });
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
        <>
            <SpaceBetween>
                <>
                    <h1>Допустимые паки</h1>
                    <LinkButton to={'createPack'} label="Создать свой"/>
                </>
            </SpaceBetween>
            <UlList size="small">
                <ListItem key={0} withSeparator>
                        <SpaceBetween>
                            <div>
                                Название
                            </div>
                            <div>
                                Автор
                            </div>
                            <div>
                                Дата создания
                            </div>
                            <div>
                                Действие
                            </div>
                        </SpaceBetween>
                    </ListItem>
                {packs && packs.map((item) => (
                    <ListItem key={item.id} withSeparator>
                        <SpaceBetween>
                            <div>
                                {item.name}
                            </div>
                            <div>
                                {item.authorName}
                            </div>
                            <div>
                                {item.created.toLocaleDateString()}
                            </div>
                            <LinkButton to={`/createSession/${item.id}`} label={"Начать игру"}/>
                        </SpaceBetween>
                    </ListItem>
                ))}
            </UlList>
        </>
    );
}

export default Packs;