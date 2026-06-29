import { ReactNode } from "react";
import { Link } from "react-router-dom";

import TableData from "../table-data/tableData";

import './TableLinkData.css';

interface ILinkProps {
    children: ReactNode;
    href: string;
    isVisited?: boolean;
}

function TableLinkData({ children, href, isVisited }: ILinkProps) {
    return (
        <TableData isVisited={isVisited}>
            <Link to={href} className="table-data-link">
                {children}
            </Link>
        </TableData>
    );
}

export default TableLinkData;