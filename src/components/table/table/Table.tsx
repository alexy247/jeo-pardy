import { ReactNode } from "react";

import './Table.css';

interface ITableProps {
    children: ReactNode 
}

function Table(props: ITableProps) {
    return (
        <table className="table">
            <tbody>
                {props.children}
            </tbody>
        </table>
    );
}

export default Table;