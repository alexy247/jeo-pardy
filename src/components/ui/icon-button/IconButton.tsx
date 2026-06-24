import { FormEvent } from 'react';

import classNames from 'classnames';

import './iconButton.css';

export type IconButtonSize = '20' | '40';

interface IconButtonProps {         
    iconName: string;
    title: string;
    onClick: (event: FormEvent<HTMLButtonElement>) => void;
    className?: string;
    size?: IconButtonSize;
}

const IconButton = ({ iconName, onClick, title, className, size = '40' }: IconButtonProps) => {
    const buttonClasses = classNames("icon-button", className);
    const iconClasses = classNames("icon-button-img", `__${size}`);
    return (
        <button className={buttonClasses} type="button" onClick={onClick} title={title}>
            <img className={iconClasses} src={`/${iconName}.png`} alt={title} />
        </button>
    );
};

export default IconButton;