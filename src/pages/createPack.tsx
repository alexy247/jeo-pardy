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
        <CenteringBlock>
            <form onSubmit={onFormSubmit}>
                <InputField ref={nameRef} label="Название" type="text" autofocus={true} />
                <ButtonsContainer>
                    <ButtonType label="Сохранить" type="submit"/>
                </ButtonsContainer>
            </form>
        </CenteringBlock>
    );
};

export default CreatePack;