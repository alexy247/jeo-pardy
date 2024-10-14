import PlayButton from '../play-button/PlayButton';

import './Title.css';

function Title() {
    return (
        <div className="title">
            <div className="title_first-line">
                    Своя
                </div>
                <div className="title_second-line">
                    игра
                </div>
                <PlayButton />
        </div>
    );
}

export default Title;