import { useParams } from "react-router-dom";
import HeaderSecond from "../components/header/header-second/HeaderSecond";
import HeaderFirst from "../components/header/header-first/HeaderFirst";

function Answer() {
    const params = useParams();

    return (
        <>
            Ответ {params.anwserId}
            <HeaderFirst>
                Категория score
            </HeaderFirst>
            <HeaderSecond>
                Формулировка вопроса
            </HeaderSecond>
            {/* Картинка/видео/аудио если нужно */}
        </>
    );
}

export default Answer;