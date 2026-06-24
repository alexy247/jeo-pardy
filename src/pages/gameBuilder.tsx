import { useParams } from "react-router-dom";
import { useCreateGameStore } from "../store/useCreateGameStore";
import { useCancellableFetch } from "../hoocks/useCancellableFetch";
import { useEffect, useRef, useState } from "react";
import { CategoryName, IBoardItem, ICategory } from "../data/types";
import { useGame } from "../context/GameContext";

import HeaderFirst from "../components/header/header-first/HeaderFirst";
import Table from "../components/ui/table/table/Table";
import TableRow from "../components/ui/table/table-row/TableRow";
import TableHeader from "../components/ui/table/table-header/TableHeader";
import TableLinkData from "../components/table/table-link-data/TableLinkData";
import CreateCategory from "../components/builder-components/create-category/createCategory";
import useCreateCategoryStore from "../store/useCreateCategoryStore";
import DeleteCategory from "../components/builder-components/delete-category/deleteCategory";
import TableData from "../components/ui/table/table-data/TableData";
import CreateQuestion from "../components/builder-components/create-question/createQuestion";

const matchCategories = (list1: ICategory[], list2: ICategory[]): ICategory[] => {
    return [...new Set([...list1, ...list2])];
};

const GameBuilder = () => {
    const params = useParams();
    const { user } = useGame();
    const { currentRoundOrderNum, currentPackId, currentRoundId, loadNewGameRound, createCategory, deleteCategory, getPricesByRoundId } = useCreateGameStore();
    const { addToMap, getByKey, removeFromMap } = useCreateCategoryStore();
    
    const abortControllerRef = useRef<AbortController>();

    const [roundsEnabled, setRoundsEnabled] = useState<boolean>(false);
    const [openRoundId, setOpenRoundId] = useState<number>(currentRoundId || 1);
    const [roundName, setRoundName] = useState<string>("");
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [rows, setBoardRows] = useState<Map<CategoryName, IBoardItem[]>>(new Map());

    const prices = getPricesByRoundId(openRoundId);
        
    // Подгружаем доску
    useCancellableFetch(async (signal) => {
        abortControllerRef.current = new AbortController();
        if (params.packId && user) {
            loadNewGameRound(params.packId, user, openRoundId, signal)
                .then((data) => {
                    if (data) {
                        const categoriesListLocal = getByKey(params.packId!, openRoundId);
                        
                        setRoundName(data.roundName);
                        setCategories(matchCategories(data.categories, categoriesListLocal));
                        setBoardRows(data.rows);
                        setRoundsEnabled(!!data.roundName);
                    }
                })
                .catch(() => {
                    // TODO: добавить страницу с ошибкой
                });
        }
    }, [currentPackId, openRoundId, user, currentRoundOrderNum, loadNewGameRound]);

    const onButtonClick = () => {
        setOpenRoundId(openRoundId + 1);
    };

    useEffect(() => {
        const categoriesListLocal = getByKey(params.packId!, openRoundId);
        setCategories(matchCategories(categories, categoriesListLocal));
    }, [getByKey, openRoundId, currentRoundOrderNum]);

    return (
        <>
            <HeaderFirst>
                Создание игры - {params.packId} - {openRoundId} - {currentPackId} - {currentRoundId} - {roundName}
            </HeaderFirst>
            {roundsEnabled && <ul>
                <li><button type="button">{currentRoundId}</button></li>
                <li><button type="button" onClick={onButtonClick}>Добавить новый раунд</button> </li>
            </ul>}
            categoriesListByPackAndRound: {JSON.stringify(getByKey(params.packId!, openRoundId))}
            <Table>
                 <TableRow key={'prices'}>
                    <TableHeader key='empty'>Категории</TableHeader>
                    {prices && prices.map((price) => (
                        <TableHeader key={price}>
                            {price}
                        </TableHeader>
                    ))}
                 </TableRow>
                {categories.map((category) => (
                    <TableRow key={category.id}>
                        <TableHeader key={category.title}>
                            {category.title}
                        </TableHeader>
                        {rows.has(category.id) && rows.get(category.id)!.map((boardItem) => (
                            <TableLinkData key={boardItem.questionId}
                                href={`question/${boardItem.questionId}`}
                                isVisited={boardItem.questionStatus == 'FINISHED'}
                            >
                                {boardItem.price}
                            </TableLinkData>
                        ))}
                        {!rows.has(category.id) && prices && prices.map((price) => (
                            <TableData key={price}>
                                <CreateQuestion category={category} packId={params.packId!} roundId={openRoundId} price={price} />
                            </TableData>
                        ))}
                        <TableData>
                            <DeleteCategory deleteCategory={deleteCategory}
                                            removeFromMap={removeFromMap}
                                            currentPackId={params.packId}
                                            currentRoundId={openRoundId}
                                            categoryId={category.id}
                            />
                        </TableData>
                    </TableRow>
                ))}
                <TableRow key={'new-category'}>
                    <TableHeader>
                        <CreateCategory createCategory={createCategory}
                                        addToMap={addToMap}
                                        currentPackId={params.packId}
                                        currentRoundId={openRoundId}
                        />
                    </TableHeader>
                </TableRow>
            </Table>
        </>
    );
}

export default GameBuilder;