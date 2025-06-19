import { ReactNode } from "react";

import './TableRow.css';

interface ITableRowProps {
    children: ReactNode 
}

function TableRow(props: ITableRowProps) {
    return (
        <tr className="table-row">
            {props.children}
        </tr>
    );
}

export default TableRow;