import { FormEvent, useState } from "react";

import { useGameStore } from "../store/useGameStore";
import { SessionId } from "../data/types";

import InputField from "../components/ui/input-field/InputField";
import ButtonsContainer from "../components/ui/buttons-container/ButtonsContainer";
import ButtonType from "../components/actions/ButtonType";
import LinkButton from "../components/actions/LinkButton";
import CenteringBlock from "../components/ui/centering-block/CenteringBlock";

const GAME_INPUT_ID = 'jeo-gid';

const SearchGame = () => {
    const { searchGame, currentRound } = useGameStore();

    const [findedGameSession, setFindedGameSession] = useState<SessionId | undefined>(undefined);
    const [stubText, setStubText] = useState<string | undefined>(undefined);

    const onFormSubmit = async (event: FormEvent) => {
        event.stopPropagation();
        event.preventDefault();

        const formElement = event.target as HTMLElement;
        const gameEl = formElement.querySelector(`#${GAME_INPUT_ID}`) as HTMLInputElement;

        if (gameEl.value) {
            searchGame(gameEl.value)
                .then((gameSessionResult) => {
                    if (gameSessionResult) {
                        setFindedGameSession(gameSessionResult);
                        setStubText(undefined);
                    } else {
                        setStubText(gameEl.value);
                    }
                });
        }

    }
    
    return (
        <CenteringBlock>
            <h1>Найти игру</h1>
            <p>Необходимо ввести 6-ти значный код:</p>
            <form onSubmit={onFormSubmit}>
                <InputField id={GAME_INPUT_ID} label="Код игры" type="text" autofocus={true} />
                {stubText && <p>Не нашли игру {stubText} </p>}
                {!findedGameSession && <ButtonsContainer>
                    <ButtonType label="Поиск" type="submit"/>
                </ButtonsContainer>}
            </form>
            {findedGameSession && <>
                <p>Игра {stubText} найдена</p>
                <ButtonsContainer>
                    <LinkButton label="Зайти" to={`/board/${findedGameSession}/${currentRound}/`}/>
                </ButtonsContainer>
            </>}
        </CenteringBlock>
    );
};

export default SearchGame;