import { Link } from "react-router-dom";

import './LinkButton.css';

interface ILinkButtonProps {
    to: string;
    title?: string;
    label: string;
}

function LinkButton(props: ILinkButtonProps) {
    const title = props.title ? props.title : props.to;
    return (
        <Link to={props.to} title={title} className="link-button">
            {props.label}
        </Link>
    );
}

export default LinkButton;