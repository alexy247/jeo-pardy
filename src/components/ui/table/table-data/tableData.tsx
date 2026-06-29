import { ReactNode } from "react";

import classNames from "classnames";

import './TableData.css';

interface ITableDataProps {
    children: ReactNode;
    isVisited?: boolean;
}

const TableData = ({ children, isVisited }: ITableDataProps) => {
    const classes = classNames("table-data", {
        ["__visited"]: isVisited
    });
    return (
        <td className={classes}>
            {children}
        </td>
    );
}

export default TableData;