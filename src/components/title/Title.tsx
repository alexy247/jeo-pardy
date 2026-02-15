import LoginButton from '../login-button/LoginButton';
import PlayButton from '../play-button/PlayButton';
import ButtonsContainer from '../ui/buttons-container/ButtonsContainer';
import CenteringBlock from '../ui/centering-block/CenteringBlock';

import './Title.css';

function Title() {
    return (
        <CenteringBlock children={
            <>
                <div className="title_first-line">
                    Своя
                </div>
                <div className="title_second-line">
                    игра
                </div>
                <ButtonsContainer>
                    <PlayButton />
                    <LoginButton />
                </ButtonsContainer>
            </>
        }/>
    );
}

export default Title;