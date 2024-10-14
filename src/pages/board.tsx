import { useParams } from "react-router-dom";

function Board() {
    const params = useParams();
    return (
        <div>
            Таблица с игрой {params.id}
        </div>
    );
};

export default Board;