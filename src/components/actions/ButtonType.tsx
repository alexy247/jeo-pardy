import "./Actions.css";

interface IButtonTypeProps {
    label: string;
    title?: string;
    type?: "button" | "submit" | "reset" | undefined;
    onClick?: () => void;
}

function ButtonType({ label, title, type = 'button', onClick }: IButtonTypeProps) {
    return (
        <button title={title} type={type} className="action" onClick={onClick}>
            {label}
        </button>
    );
}

export default ButtonType;