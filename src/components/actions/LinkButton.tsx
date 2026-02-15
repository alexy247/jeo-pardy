import { Link } from "react-router-dom";

import classNames from "classnames";

import "./Actions.css";

interface ILinkButtonProps {
    to: string;
    label: string;
    title?: string;
    className?: string;
}

function LinkButton({ to, label, title, className }: ILinkButtonProps) {
    const titleDefault = title ? title : to;
    const classes = classNames('action', className);
    return (
        <Link to={to} title={titleDefault} className={classes}>
            {label}
        </Link>
    );
}

export default LinkButton;