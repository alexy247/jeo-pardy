import LinkButton from '../actions/LinkButton';

function LoginButton({ className }: any ) {
    return (
        <LinkButton to={"/login"} label="Войти" className={className} />
    );
}

export default LoginButton;