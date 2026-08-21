import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { FormEvent, useRef, useState } from "react";

import CenteringBlock from "../components/ui/centering-block/CenteringBlock";
import InputField from "../components/ui/input-field/InputField";
import ButtonsContainer from "../components/ui/buttons-container/ButtonsContainer";
import ButtonType from "../components/actions/ButtonType";
import LinkButton from "../components/actions/LinkButton";

const START_PAGE = '/packs';

function Registration() {
    const { user, signUp } = useGame();
    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null);

    if (user) {
        navigate(START_PAGE);
    }

    const userNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);
    
    const onSubmit = (event: FormEvent) => {
        event.stopPropagation();
        event.preventDefault();

        const userNameValue = userNameRef.current?.value;
        const emailValue = emailRef.current?.value;
        const passValue = passRef.current?.value;

        if (userNameValue && emailValue && passValue) {
            signUp!(emailValue, passValue, userNameValue)
                .then((success) => success ?? navigate(START_PAGE))
                .catch((err) => {
                    setError(err.message);
                });
        }
    };

    return (
        <form onSubmit={onSubmit}>  
            <CenteringBlock>
                <h1>Регистрация</h1>
                <InputField ref={userNameRef}
                            type="text"
                            label="Никнейм"
                />
                <InputField ref={emailRef}
                            type="text"
                            label="Почта"
                />
                <InputField ref={passRef}
                            type="password"
                            label="Пароль"
                />
                {error && <p>{error}</p>}
            </CenteringBlock>
            <ButtonsContainer isVerticalAlign>
                <ButtonType label="Сохранить" type="submit"/>
                <LinkButton label="Войти" to="/login"/>
            </ButtonsContainer>
        </form>
    );
}

export default Registration;