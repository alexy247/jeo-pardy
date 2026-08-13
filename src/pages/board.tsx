import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useCancellableFetch } from "../hoocks/useCancellableFetch";
import { useGameStore } from "../store/useGameStore";
import { CategoryName, IBoardItem } from "../data/types";
import { useGame } from "../context/GameContext";

import TableLinkData from "../components/ui/table/table-link-data/TableLinkData";
import TableHeader from "../components/ui/table/table-header/TableHeader";
import TableRow from "../components/ui/table/table-row/TableRow";
import Table from "../components/ui/table/table/Table";
import HeaderFirst from "../components/header/header-first/HeaderFirst";
import TableActions from "../components/table-actions/TableActions";
import CenteringBlock from "../components/ui/centering-block/CenteringBlock";

function Board() {
    const params = useParams();
    const { user } = useGame();
    const { currentRound, currentGameSession, currentSessionNumberOfRounds, loadRounds, loadCurrentRound, loadPlayers, loadScore, nextRound, setRound } = useGameStore();
    
    const abortControllerRef = useRef<AbortController>();
    const abortControllerPlayersRef = useRef<AbortController>();
    const abortControllerScoreRef = useRef<AbortController>();
    const abortControllerRoundsRef = useRef<AbortController>();
  
    const [roundName, setRoundName] = useState<string>("");
    const [categories, setCategories] = useState<string[]>([])
    const [rows, setBoardRows] = useState<Map<CategoryName, IBoardItem[]>>(new Map());

    const checkStoreData = useCallback((): void => {
        if (Number(params.roundOrder) != currentRound) {
            console.log('Раунд в сторе отличается от раунда в ссылке');
            setRound(Number(params.roundOrder));
        }
    }, [params.roundOrder, currentRound]);

    useEffect(() => {
        checkStoreData();
    }, [checkStoreData]);

    // Мемоизируем загрузку доски
    const loadBoardData = useCallback(async (signal: AbortSignal) => {
        if (!user) return;
        
        loadCurrentRound(user, signal)
            .then((data) => {
                if (data) {
                    setRoundName(data.roundName);
                    setCategories(data.categoriesNames);
                    setBoardRows(data.rows);
                }
            })
            .catch(() => {
                // TODO: добавить страницу с ошибкой
            });
    }, [user, loadCurrentRound]);
    
    // Подгружаем доску
    useCancellableFetch(async (signal) => {
        abortControllerRef.current = new AbortController();
        await loadBoardData(signal);
    }, [loadBoardData]);

    // Подгружаем актуальные данные про текущих игроков
    useCancellableFetch(async (signal) => {
        abortControllerPlayersRef.current = new AbortController();
        await loadPlayers(signal);
    }, [loadPlayers]);

    // Подгружаем актуальный счет текущего игрока
    useCancellableFetch(async (signal) => {
        abortControllerScoreRef.current = new AbortController();
        if (user) {
            await loadScore(user, signal);
        }
    }, [user, loadScore]);

    // Подгружаем кол-во раундов в игре
    useCancellableFetch(async (signal) => {
        abortControllerRoundsRef.current = new AbortController();
        if (currentSessionNumberOfRounds == undefined) {
            console.log('Мы не знаем сколько раундов будет в игре, подгружаем');
            await loadRounds(signal);
        }
    }, [currentSessionNumberOfRounds, loadRounds]);

    // Мемоизируем отсортированные boardItem
    const sortedCategoryRows = useMemo(() => {
        let result = new Map<CategoryName, IBoardItem[]>();
        categories.forEach((category) => {
            if (rows.has(category)) {
                result.set(category, rows.get(category)!.sort((a, b) => a.price - b.price));
            }
            
        });
        return result;
    }, [rows, categories]);

     // Мемоизируем строчки таблицы
    const tableRows = useMemo(() => {
        return categories.map((category) => {
            const sortedItems = sortedCategoryRows.get(category) || [];
            return (
                <TableRow key={category}>
                    <TableHeader>{category}</TableHeader>
                    {sortedItems.map((boardItem) => (
                        <TableLinkData 
                            key={boardItem.questionId}
                            href={`question/${boardItem.questionId}`}
                            isVisited={boardItem.questionStatus === 'FINISHED'}
                        >
                            {boardItem.price}
                        </TableLinkData>
                    ))}
                </TableRow>
            );
        });
    }, [categories, sortedCategoryRows]);

        // Используем useMemo для подсчета завершенных вопросов
    const allQuestionsFinished = useMemo(() => {
        if (!rows || rows.size === 0) return false;
        
        let totalQuestions = 0;
        let finishedQuestions = 0;
        
        for (const [_, items] of rows) {
            totalQuestions += items.length;
            finishedQuestions += items.filter(item => item.questionStatus === 'FINISHED').length;
        }
        
        // Возвращаем true, если все вопросы завершены
        return totalQuestions > 0 && totalQuestions === finishedQuestions;
    }, [rows]);

    return (<>
            <HeaderFirst>
                Таблица с игрой - {roundName}
            </HeaderFirst>
            <CenteringBlock size="large">
                <Table>
                    {tableRows}
                </Table>
            </CenteringBlock>
            <TableActions currentGameSession={currentGameSession} currentRound={currentRound} roundsCount={currentSessionNumberOfRounds} allQuestionsFinished={allQuestionsFinished} nextRound={nextRound} />
        </>
    );
};

export default Board;