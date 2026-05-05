interface IGameNameProps {
    name: string;
}

function GameName({ name }: IGameNameProps) {
    return (
        <div>
            {name}
        </div>
    );
};

export default GameName;