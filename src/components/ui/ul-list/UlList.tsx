import { ReactNode } from 'react';

import classNames from 'classnames';

import './UlList.css';

export type UlListSize = 'small' | 'large';

interface IUlListProps {
    size?: UlListSize;
    children: ReactNode;
}

function UlList({ size = 'large', children }: IUlListProps) {
    const ulClasses = classNames("ul-list", `__${size}`);
    
    return (
        <ul className={ulClasses}>
            {children}
        </ul>
    );
}

export default UlList;