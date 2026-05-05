import { ReactNode } from 'react';

import classNames from 'classnames';

import './ListItem.css';

interface IListItemProps {
    withSeparator?: boolean;
    children: ReactNode;
}

function ListItem({ withSeparator = false, children }: IListItemProps) {
    const liClasses = classNames("item", {
        '__with-separator': withSeparator
    });

    return (
        <li className={liClasses}>
            {children}
        </li>
    );
}

export default ListItem;