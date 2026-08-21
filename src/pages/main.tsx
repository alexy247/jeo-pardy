import LoginButton from "../components/login-button/LoginButton";
import PlayButton from "../components/play-button/PlayButton";

import Title from "../components/ui/title/Title";
import ButtonsContainer from "../components/ui/buttons-container/ButtonsContainer";

export const Main = () => {
    return (
        <>
            <Title/>
            <ButtonsContainer isVerticalAlign>
                <PlayButton />
                <LoginButton />
            </ButtonsContainer>
        </>
    );
};

export default Main;