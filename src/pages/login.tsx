import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

import ButtonType from "../components/actions/ButtonType";
import LinkButton from "../components/actions/LinkButton";
import CenteringBlock from "../components/ui/centering-block/CenteringBlock";
import ButtonsContainer from "../components/ui/buttons-container/ButtonsContainer";
import InputField from "../components/ui/input-field/InputField";

const EMAIL_INPUT_ID = 'jeo-mail';
const PASS_INPUT_ID = 'jeo-pass';
const START_PAGE = '/packs';

function Login() {
    const { user, signIn } = useGame();
    const navigate = useNavigate();

    if (user) {
        navigate(START_PAGE);
    }
    
    const onSubmit = (event: FormEvent) => {
        event.stopPropagation();
        event.preventDefault();

        const formElement = event.target as HTMLElement;
        const email = formElement.querySelector(`#${EMAIL_INPUT_ID}`) as HTMLInputElement;
        const pass = formElement.querySelector(`#${PASS_INPUT_ID}`) as HTMLInputElement;

        const emailValue = email.value;
        const passValue = pass.value;

        if (emailValue != undefined && passValue != undefined) {
            signIn!(emailValue, passValue).then((success) => success ?? navigate(START_PAGE));
        }
    };

    return (
        <CenteringBlock>
            <form onSubmit={onSubmit}>
                <h1>Авторизация</h1>
                <InputField id={EMAIL_INPUT_ID}
                            type="text"
                            label="Почта"
                />
                <InputField id={PASS_INPUT_ID}
                            type="password"
                            label="Пароль"
                />
                <ButtonsContainer>
                    <ButtonType label="Войти" type="submit"/>
                    <LinkButton label="Регистрация" to="/registration"/>
                </ButtonsContainer>
            </form>
        </CenteringBlock>
    );
}

export default Login;