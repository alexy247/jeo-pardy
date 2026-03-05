import { useParams } from "react-router-dom";
import { useRef, useState } from "react";

import { IAnswer } from "../data/types";
import { useGameStore } from "../store/useGameStore";
import { useCancellableFetch } from "../hoocks/useCancellableFetch";
import { MediaBlock } from "../components/media-component/MediaBlock";

import HeaderSecond from "../components/header/header-second/HeaderSecond";
import HeaderFirst from "../components/header/header-first/HeaderFirst";
import LinkButton from "../components/actions/LinkButton";

function Answer() {
    const params = useParams();
    const [answer, setAnswer] = useState<IAnswer>();
    const { loadAnswer, currentQuestion } = useGameStore();
    const abortControllerRef = useRef<AbortController>();

    useCancellableFetch(async (signal) => {
        abortControllerRef.current = new AbortController();
        if (params.questionId) {
            loadAnswer(params.questionId, signal)
                .then((data) => {
                    setAnswer(data);
                })
                .catch(() => {
                    // TODO: добавить страницу с ошибкой c EXEPTION-01
                    // EXEPTION-01|Question 92ccb882-1351-4a87-9d2c-f3dccb246ca4 has already done for user d01fd48b-01ac-4d88-8230-25600d588894
                });
            }
    });

    return (
        <>
            Ответ {params.anwserId}
            <HeaderFirst>
                {currentQuestion?.categoryName} за {currentQuestion?.price}
            </HeaderFirst>
            <HeaderSecond>
                {answer?.answerText}
            </HeaderSecond>
            <MediaBlock mediaObject={answer!} />
            <LinkButton to={`/board/${params.sessionId}/${params.roundOrder}/`} label={"К доске"} />
        </>
    );
}

export default Answer;