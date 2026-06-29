import { ReactNode } from "react";

import './TableHeader.css';

interface ITableHeaderProps {
    children: ReactNode 
}

function TableHeader(props: ITableHeaderProps) {
    return (
        <th className="table-header">
            {props.children}
        </th>
    );
}

export default TableHeader;