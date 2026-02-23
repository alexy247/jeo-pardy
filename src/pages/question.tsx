import { useParams } from "react-router-dom";

import HeaderSecond from "../components/header/header-second/HeaderSecond";
import HeaderFirst from "../components/header/header-first/HeaderFirst";
import Timer from "../components/timer/Timer";

function Question() {
    const params = useParams();

    return (
        <>
            Вопрос {params.questionId}
            <HeaderFirst>
                Категория score
            </HeaderFirst>
            <HeaderSecond>
                Формулировка вопроса
            </HeaderSecond>
            {/* Картинка/видео/аудио если нужно */}
            <Timer/>
        </>
    );
}

export default Question;