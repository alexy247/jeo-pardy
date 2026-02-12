import LinkButton from '../actions/LinkButton';

function PlayButton() {
    return (
        <LinkButton to={"/categories"} label="Играть" />
    );
}

export default PlayButton;