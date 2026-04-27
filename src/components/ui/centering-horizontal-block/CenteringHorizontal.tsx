import { ReactNode } from 'react';
import classNames from 'classnames';

import './CenteringHorizontal.css';

interface ICenteringHorizontalProps {
    children: ReactNode;
    isBottom?: boolean;
}

function CenteringHorizontal({ children, isBottom = false }: ICenteringHorizontalProps) {
    const blockClassNames = classNames("centering-horizontal", {
        ["__bottom"]: isBottom
    });

    return (
        <div className={blockClassNames}>
            {children}
        </div>
    );
}

export default CenteringHorizontal;