import classNames from "classnames";
import "./Actions.css";

interface IButtonTypeProps {
    label: string;
    title?: string;
    type?: "button" | "submit" | "reset" | undefined;
    className?: string;
    onClick?: () => void;
}

function ButtonType({ label, title, type = 'button', className, onClick }: IButtonTypeProps) {
    const buttonClassNames = classNames("action", className);

    return (
        <button title={title} aria-label={label} type={type} className={buttonClassNames} onClick={onClick}>
            {label}
        </button>
    );
}

export default ButtonType;