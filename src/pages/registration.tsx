import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { FormEvent } from "react";

import CenteringBlock from "../components/ui/centering-block/CenteringBlock";
import InputField from "../components/ui/input-field/InputField";
import ButtonsContainer from "../components/ui/buttons-container/ButtonsContainer";
import ButtonType from "../components/actions/ButtonType";
import LinkButton from "../components/actions/LinkButton";

const USER_NAME_INPUT_ID = 'jeo-user-name-sign-up';
const EMAIL_INPUT_ID = 'jeo-mail-sign-up';
const PASS_INPUT_ID = 'jeo-pass-sign-up';
const START_PAGE = '/packs';

function Registration() {
    const { user, signUp } = useGame();
    const navigate = useNavigate();

    if (user) {
        navigate(START_PAGE);
    }
    
    const onSubmit = (event: FormEvent) => {
        event.stopPropagation();
        event.preventDefault();

        const formElement = event.target as HTMLElement;
        const userName = formElement.querySelector(`#${USER_NAME_INPUT_ID}`) as HTMLInputElement;
        const email = formElement.querySelector(`#${EMAIL_INPUT_ID}`) as HTMLInputElement;
        const pass = formElement.querySelector(`#${PASS_INPUT_ID}`) as HTMLInputElement;

        const userNameValue = userName.value;
        const emailValue = email.value;
        const passValue = pass.value;

        if (emailValue != undefined && passValue != undefined) {
            signUp!(emailValue, passValue, userNameValue).then((success) => success ?? navigate(START_PAGE));
        }
    };

    return (
        <CenteringBlock>
            <form onSubmit={onSubmit}>
                <h1>Регистрация</h1>
                <InputField id={USER_NAME_INPUT_ID}
                            type="text"
                            label="Никнейм"
                />
                <InputField id={EMAIL_INPUT_ID}
                            type="text"
                            label="Почта"
                />
                <InputField id={PASS_INPUT_ID}
                            type="password"
                            label="Пароль"
                />
                <ButtonsContainer>
                    <ButtonType label="Сохранить" type="submit"/>
                    <LinkButton label="Войти" to="/login"/>
                </ButtonsContainer>
            </form>
        </CenteringBlock>
    );
}

export default Registration;