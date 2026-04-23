import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useCancellableFetch } from "../hoocks/useCancellableFetch";
import { useGameStore } from "../store/useGameStore";
import { CategoryName, IBoardItem } from "../data/types";
import { useGame } from "../context/GameContext";

import TableLinkData from "../components/table/table-link-data/TableLinkData";
import TableHeader from "../components/table/table-header/TableHeader";
import TableRow from "../components/table/table-row/TableRow";
import Table from "../components/table/table/Table";
import HeaderFirst from "../components/header/header-first/HeaderFirst";

function Board() {
    const params = useParams();
    const { user } = useGame();
    const { loadCurrentRound, currentRound, currentGameSession, setRound } = useGameStore();
    const abortControllerRef = useRef<AbortController>();
  
    const [roundName, setRoundName] = useState<string>("");
    const [categories, setCategories] = useState<string[]>([])
    const [rows, setBoardRows] = useState<Map<CategoryName, IBoardItem[]>>(new Map())

    if (Number(params.roundOrder) != currentRound) {
        console.log('Раунд в сторе отличается от раунда в ссылке');
        setRound(Number(params.roundOrder));
    }

    useCancellableFetch(async (signal) => {
        abortControllerRef.current = new AbortController();
        if (user) {
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
        }
    }, [currentGameSession, currentRound, user]);

    return (<>
            <HeaderFirst>
                Таблица с игрой - {roundName}
            </HeaderFirst>
            <Table>
                {categories.map((category) => (
                    <TableRow key={category}>
                        <TableHeader>
                            {category}
                        </TableHeader>
                        {rows.get(category)!.map((boardItem) => (
                            <TableLinkData key={boardItem.questionId}
                                href={`question/${boardItem.questionId}`}
                                isVisited={boardItem.questionStatus == 'FINISHED'}
                            >
                                {boardItem.price}
                            </TableLinkData>
                        ))}
                    </TableRow>
                ))}
            </Table>
        </>
    );
};

export default Board;