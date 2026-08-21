import { FormEvent, useRef, useState } from "react";

import { useGameStore } from "../store/useGameStore";
import { SessionId } from "../data/types";

import InputField from "../components/ui/input-field/InputField";
import ButtonsContainer from "../components/ui/buttons-container/ButtonsContainer";
import ButtonType from "../components/actions/ButtonType";
import LinkButton from "../components/actions/LinkButton";
import CenteringBlock from "../components/ui/centering-block/CenteringBlock";

const SearchGame = () => {
    const { searchGame, currentRound } = useGameStore();

    const [findedGameSession, setFindedGameSession] = useState<SessionId | undefined>(undefined);
    const [stubText, setStubText] = useState<string | undefined>(undefined);

    const gameCodeRef = useRef<HTMLInputElement>(null);

    const onFormSubmit = async (event: FormEvent) => {
        event.stopPropagation();
        event.preventDefault();

        const gameCode = gameCodeRef.current?.value;

        if (gameCode) {
            searchGame(gameCode)
                .then((gameSessionResult) => {
                    if (gameSessionResult) {
                        setFindedGameSession(gameSessionResult);
                        setStubText(undefined);
                    } else {
                        setStubText(gameCode);
                    }
                });
        }

    }
    
    return (
        <form onSubmit={onFormSubmit}>
            <CenteringBlock>
                <h1>Найти игру</h1>
                <p>Необходимо ввести 6-ти значный код:</p>
                
                    <InputField ref={gameCodeRef} label="Код игры" type="text" autofocus={true} />
                    {stubText && <p>Не нашли игру {stubText} </p>}
                    {findedGameSession && <p>Игра {stubText} найдена</p>}
            </CenteringBlock>
            {!findedGameSession && 
                <ButtonsContainer isVerticalAlign>
                    <ButtonType label="Поиск" type="submit"/>
                </ButtonsContainer>}
            {findedGameSession && 
                <ButtonsContainer isVerticalAlign>
                    <LinkButton label="Зайти" to={`/board/${findedGameSession}/${currentRound}/`}/>
                </ButtonsContainer>}
        </form>
    );
};

export default SearchGame;