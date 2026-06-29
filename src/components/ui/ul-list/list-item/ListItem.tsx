import { ReactNode } from 'react';

import classNames from 'classnames';

import './ListItem.css';

interface IListItemProps {
    children: ReactNode;
    withSeparator?: boolean;
    isActive?: boolean;
    isHorizontal?: boolean;
}

function ListItem({ withSeparator = false, isActive = false, isHorizontal = false, children }: IListItemProps) {
    const liClasses = classNames("item", {
        '__with-separator': withSeparator,
        '__is-active': isActive,
        '__horizontal': isHorizontal,
    });

    return (
        <li className={liClasses}>
            {children}
        </li>
    );
}

export default ListItem;