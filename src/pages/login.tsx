import { FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

import ButtonType from "../components/actions/ButtonType";
import LinkButton from "../components/actions/LinkButton";
import CenteringBlock from "../components/ui/centering-block/CenteringBlock";
import ButtonsContainer from "../components/ui/buttons-container/ButtonsContainer";
import InputField from "../components/ui/input-field/InputField";

const START_PAGE = '/packs';

function Login() {
    const { user, signIn } = useGame();
    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null);

    if (user) {
        navigate(START_PAGE);
    }

    const emailRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);
    
    const onSubmit = (event: FormEvent) => {
        event.stopPropagation();
        event.preventDefault();

        const emailValue = emailRef.current?.value;
        const passValue = passRef.current?.value;

        if (emailValue != undefined && passValue != undefined) {
            signIn!(emailValue, passValue)
                .then((success) => success ?? navigate(START_PAGE))
                .catch((err) => {
                    setError(err.message);
                });
        }
    };

    return (
        <CenteringBlock>
            <form onSubmit={onSubmit}>
                <h1>Авторизация</h1>
                <InputField ref={emailRef}
                            type="text"
                            label="Почта"
                />
                <InputField ref={passRef}
                            type="password"
                            label="Пароль"
                />
                {error && <p>{error}</p>}
                <ButtonsContainer>
                    <ButtonType label="Войти" type="submit"/>
                    <LinkButton label="Регистрация" to="/registration"/>
                </ButtonsContainer>
            </form>
        </CenteringBlock>
    );
}

export default Login;