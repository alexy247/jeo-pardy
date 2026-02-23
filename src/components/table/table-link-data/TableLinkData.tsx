import { ReactNode } from "react";
import { Link } from "react-router-dom";

import classNames from "classnames";

import './TableLinkData.css';


interface ILinkProps {
    children: ReactNode;
    href: string;
    isVisited?: string;
}

function TableLinkData({ children, href, isVisited }: ILinkProps) {
    const classes = classNames("table-data", {
        ["__visited"]: isVisited
    });
    return (
        <td className={classes}>
            <Link to={href} className="table-data-link">
                {children}
            </Link>
        </td>
    );
}

export default TableLinkData;