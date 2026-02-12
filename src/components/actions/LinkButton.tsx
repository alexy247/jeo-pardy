import { Link } from "react-router-dom";

import "./Actions.css";

interface ILinkButtonProps {
    to: string;
    label: string;
    title?: string;
}

function LinkButton({ to, label, title }: ILinkButtonProps) {
    const titleDefault = title ? title : to;
    return (
        <Link to={to} title={titleDefault} className="action">
            {label}
        </Link>
    );
}

export default LinkButton;