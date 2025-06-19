import { useParams } from "react-router-dom";
import { scores, categories } from "../data/data";

import TableData from "../components/table/table-data/TableData";
import TableHeader from "../components/table/table-header/TableHeader";
import TableRow from "../components/table/table-row/TableRow";
import Table from "../components/table/table/Table";
import HeaderFirst from "../components/header/header-first/HeaderFirst";

function Board() {
    const params = useParams();
    return (<>
            <HeaderFirst>
                Таблица с игрой {params.id}
            </HeaderFirst>
            <Table>
                {categories.map((category) => (
                        <TableRow>
                        <TableHeader>
                            {category}
                        </TableHeader>
                        {scores.map((score) => (
                            <TableData>
                                {score}
                            </TableData>
                        ))}
                    </TableRow>
                ))}
            </Table>
        </>
    );
};

export default Board;