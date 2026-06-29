import { useNavigate } from "react-router-dom";
import { useCreateGameStore } from "../store/useCreateGameStore";
import { useGame } from "../context/GameContext";
import { FormEvent } from "react";
import CenteringBlock from "../components/ui/centering-block/CenteringBlock";
import InputField from "../components/ui/input-field/InputField";
import ButtonsContainer from "../components/ui/buttons-container/ButtonsContainer";
import ButtonType from "../components/actions/ButtonType";

const PACK_NAME_ID = `create-pack-name`;

const CreatePack = () => {
    const navigate = useNavigate();
    const { user } = useGame();
    const { createPack } = useCreateGameStore();

    const onFormSubmit = async (event: FormEvent) => {
        event.stopPropagation();
        event.preventDefault();

        const formElement = event.target as HTMLElement;
        const packNameEl = formElement.querySelector(`#${PACK_NAME_ID}`) as HTMLInputElement;

        if (packNameEl && packNameEl.value && user) {
            if (user) {
                createPack(user, packNameEl.value)
                    .then((data) => {
                        navigate(`/packs/builder/${data}`);
                    })
                    .catch((res) => {
                        console.log(res);
                    });
            }
        }
    };

    return (
        <CenteringBlock>
            <form onSubmit={onFormSubmit}>
                <InputField id={PACK_NAME_ID} label="Название" type="text" autofocus={true} />
                <ButtonsContainer>
                    <ButtonType label="Сохранить" type="submit"/>
                </ButtonsContainer>
            </form>
        </CenteringBlock>
    );
};

export default CreatePack;