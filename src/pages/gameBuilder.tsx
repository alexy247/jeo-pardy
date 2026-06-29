import { useNavigate, useParams } from "react-router-dom";
import { useCreateGameStore } from "../store/useCreateGameStore";
import { useCancellableFetch } from "../hoocks/useCancellableFetch";
import { useEffect, useRef, useState } from "react";
import { CategoryName, IBoardItem, ICategory, INewBoard } from "../data/types";
import { useGame } from "../context/GameContext";

import HeaderFirst from "../components/header/header-first/HeaderFirst";
import Table from "../components/ui/table/table/Table";
import TableRow from "../components/ui/table/table-row/TableRow";
import TableHeader from "../components/ui/table/table-header/TableHeader";
import CreateCategory from "../components/builder-components/create-category/createCategory";
import useCreateCategoryStore from "../store/useCreateCategoryStore";
import DeleteCategory from "../components/builder-components/delete-category/deleteCategory";
import TableData from "../components/ui/table/table-data/tableData";
import CreateQuestion from "../components/builder-components/create-question/createQuestion";
import UlList from "../components/ui/ul-list/UlList";
import ListItem from "../components/ui/ul-list/list-item/ListItem";
import EditQuestion from "../components/builder-components/edit-question/editQuestion";
import CenteringBlock from "../components/ui/centering-block/CenteringBlock";
import CenteringHorizontal from "../components/ui/centering-horizontal-block/CenteringHorizontal";
import ButtonType from "../components/actions/ButtonType";

const matchCategories = (list1: ICategory[], list2: ICategory[]): ICategory[] => {
    return [...new Map([...list1, ...list2].map(item => [item.id, item])).values()];
};

const checkIsBoardFull = (board: INewBoard, prices: number[]) => {
    const categories = board.categories;
    const lenght = prices.length;

    return categories.filter((item) => board.rows.get(item.id)?.length != lenght).length < 1;
};

const GameBuilder = () => {
    const params = useParams();
    const navigate = useNavigate();
    const { user } = useGame();
    const { currentRoundOrderNum, currentPackId, currentRoundId, loadNewGameRound, createCategory, deleteCategory, getPricesByRoundId, savePack } = useCreateGameStore();
    const { addToMap, getByKey, removeFromMap } = useCreateCategoryStore();
    
    const abortControllerRef = useRef<AbortController>();

    const [roundsEnabled, setRoundsEnabled] = useState<boolean>(false);
    const [openRoundId, setOpenRoundId] = useState<number>(currentRoundId || 1);
    const [roundName, setRoundName] = useState<string>("");
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [rows, setBoardRows] = useState<Map<CategoryName, IBoardItem[]>>(new Map());
    const [isBoardFull, setIsBoardFull] = useState<boolean>(false);

    const prices = getPricesByRoundId(openRoundId);
        
    // Подгружаем доску
    useCancellableFetch(async (signal) => {
        abortControllerRef.current = new AbortController();
        if (params.packId && user) {
            loadNewGameRound(params.packId, user, openRoundId, signal)
                .then((data) => {
                    if (data) {
                        setRoundName(data.roundName);
                        setCategories(matchCategories(categories, data.categories));
                        setBoardRows(data.rows);
                        setRoundsEnabled(!!data.roundName);
                        setIsBoardFull(checkIsBoardFull(data, prices));
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

    const questionsData = (category: ICategory) => (
        <>
            {prices.map((price) => {
                if (!rows.has(category.id)) {
                    return (
                        <TableData key={price}>
                            <CreateQuestion category={category} packId={params.packId!} roundId={openRoundId} price={price} />
                        </TableData>
                    );
                }
                if (rows.has(category.id) && rows.get(category.id)!.filter(item => item.price == price).length === 1) {
                    const boardItem = rows.get(category.id)!.filter(item => item.price == price)[0];
                    return (
                        <TableData key={price}>
                            <EditQuestion category={category} packId={params.packId!} roundId={openRoundId} price={boardItem.price} />
                        </TableData>
                    );
                } else {
                    return (
                        <TableData key={price}>
                            <CreateQuestion category={category} packId={params.packId!} roundId={openRoundId} price={price} />
                        </TableData>
                    );
                }
            })}
        </>
    );

    const onSaveButtonClick = () => {
        if (params.packId && user) {
            savePack(user, params.packId)
                .then(() => navigate(`/packs`))
                .catch(() => {
                    // TODO: добавить страницу с ошибкой
                });;
        }
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
            {JSON.stringify(getByKey(params.packId!, openRoundId))}
            {roundsEnabled && <UlList size="small" isWitoutPadding>
                <ListItem key="question" isActive={openRoundId === 1} isHorizontal>
                    <button className="page-change-button" onClick={() => setOpenRoundId(1)}>
                        {roundName}
                    </button>
                </ListItem>
                <ListItem key="answer" isActive={openRoundId === 2} isHorizontal>
                    <button className="page-change-button" onClick={onButtonClick}>
                        Добавить новый раунд
                    </button>
                </ListItem>
            </UlList>}
            <CenteringBlock size="large">
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
                            {questionsData(category)}
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
            </CenteringBlock>
            {isBoardFull && <CenteringHorizontal isBottom>
                <ButtonType label="Сохранить пак" type="button" onClick={onSaveButtonClick}/>
            </CenteringHorizontal>}
        </>
    );
}

export default GameBuilder;