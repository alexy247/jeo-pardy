import { ReactNode } from "react";

import './TableData.css';

interface ITableDataProps {
    children: ReactNode 
}

function TableData(props: ITableDataProps) {
    return (
        <td className="table-data">
            {props.children}
        </td>
    );
}

export default TableData;