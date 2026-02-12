import "./Actions.css";

interface IButtonTypeProps {
    label: string;
    title?: string;
    type?: "button" | "submit" | "reset" | undefined;
}

function ButtonType({ label, title, type = 'button' }: IButtonTypeProps) {
    return (
        <button title={title} type={type} className="action">
            {label}
        </button>
    );
}

export default ButtonType;