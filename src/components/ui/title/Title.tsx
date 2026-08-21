import CenteringBlock from '../centering-block/CenteringBlock';

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
            </>
        }/>
    );
}

export default Title;