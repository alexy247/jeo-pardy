import { ReactNode } from 'react';

import classNames from 'classnames';

import './UlList.css';

export type UlListSize = 'small' | 'large';

interface IUlListProps {
    children: ReactNode;
    size?: UlListSize;
    isWitoutPadding?: boolean;
}

function UlList({ size = 'large', children, isWitoutPadding = false }: IUlListProps) {
    const ulClasses = classNames("ul-list", `__${size}`, {
        '__without-padding': isWitoutPadding
    });
    
    return (
        <ul className={ulClasses}>
            {children}
        </ul>
    );
}

export default UlList;