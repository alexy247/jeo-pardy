import { Link } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import LinkButton from "../link-button/LinkButton";

function EmptyPage() {
    return (
        <Fragment>
            <h1>
                Страница не найдена!
            </h1>
            <LinkButton to="/" label="Вернуться на главную" />
        </Fragment>
    );
}

export default EmptyPage;