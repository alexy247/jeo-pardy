import { ReactNode } from 'react';

import './CenteringBlock.css';
import classNames from 'classnames';

type BlockSize = 'small' | 'large';

interface ICenteringBlockProps {
    size?: BlockSize;
    children: ReactNode;
}

function CenteringBlock({ size = 'small', children }: ICenteringBlockProps) {
    const classes = classNames('center', {
        '__small': size === 'small',
        '__large': size === 'large',
    });
    return (
        <div className={classes}>
            {children}
        </div>
    );
};

export default CenteringBlock;