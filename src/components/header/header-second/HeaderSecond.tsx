import { ReactNode } from "react";

import './HeaderSecond.css';

interface IHeaderSecondProps {
    children: ReactNode 
}

function HeaderSecond(props: IHeaderSecondProps) {
    return (
        <h2 className="header-second">
            {props.children}
        </h2>
    );
}

export default HeaderSecond;