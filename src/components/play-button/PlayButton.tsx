import LinkButton from '../link-button/LinkButton';

import './PlayButton.css';

function PlayButton() {
    return (
        <LinkButton to={"/categories"} label="Играть" />
    );
}

export default PlayButton;