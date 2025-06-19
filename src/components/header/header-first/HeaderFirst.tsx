import { ReactNode } from "react";

import './HeaderFirst.css';

interface IHeaderFirstProps {
    children: ReactNode 
}

function HeaderFirst(props: IHeaderFirstProps) {
    return (
        <h1 className="header-first">
            {props.children}
        </h1>
    );
}

export default HeaderFirst;