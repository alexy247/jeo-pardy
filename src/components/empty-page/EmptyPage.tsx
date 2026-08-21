import { Fragment } from "react/jsx-runtime";
import LinkButton from "../actions/LinkButton";
import ButtonsContainer from "../ui/buttons-container/ButtonsContainer";

function EmptyPage() {
    return (
        <Fragment>
            <h1>
                Страница не найдена!
            </h1>
            <ButtonsContainer isVerticalAlign>
                <LinkButton to="/" label="Вернуться на главную" />
            </ButtonsContainer>
        </Fragment>
    );
}

export default EmptyPage;