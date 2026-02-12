import LinkButton from '../actions/LinkButton';

function LoginButton() {
    return (
        <LinkButton to={"/login"} label="Войти" />
    );
}

export default LoginButton;