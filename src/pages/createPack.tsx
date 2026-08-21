import { useNavigate } from "react-router-dom";
import { useCreateGameStore } from "../store/useCreateGameStore";
import { useGame } from "../context/GameContext";
import { FormEvent, useRef } from "react";

import CenteringBlock from "../components/ui/centering-block/CenteringBlock";
import InputField from "../components/ui/input-field/InputField";
import ButtonsContainer from "../components/ui/buttons-container/ButtonsContainer";
import ButtonType from "../components/actions/ButtonType";

const CreatePack = () => {
    const navigate = useNavigate();

    const { user } = useGame();
    const { createPack } = useCreateGameStore();

    const nameRef = useRef<HTMLInputElement>(null);

    const onFormSubmit = async (event: FormEvent) => {
        event.stopPropagation();
        event.preventDefault();

        const packName = nameRef.current?.value;

        if (packName && user) {
            createPack(user, packName)
                .then((data) => {
                    navigate(`/packs/builder/${data}`);
                })
                .catch((res) => {
                    console.log(res);
                });
        }
    };

    return (
        <form onSubmit={onFormSubmit}>
            <CenteringBlock>
                <h1>Создать свой пак</h1>
                <p>Необходимо придумать название:</p>
                <InputField ref={nameRef} label="Имя пака" type="text" autofocus={true} />
            </CenteringBlock>
            <ButtonsContainer isVerticalAlign>
                <ButtonType label="Сохранить" type="submit"/>
            </ButtonsContainer>
        </form>
    );
};

export default CreatePack;