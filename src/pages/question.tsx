import { useParams } from "react-router-dom";

import { IQuestion } from "../data/types";
import { useRef, useState } from "react";
import { useGameStore } from "../store/useGameStore";

import HeaderSecond from "../components/header/header-second/HeaderSecond";
import HeaderFirst from "../components/header/header-first/HeaderFirst";
import Timer from "../components/timer/Timer";
import LinkButton from "../components/actions/LinkButton";

import { useCancellableFetch } from "../hoocks/useCancellableFetch";
import { MediaBlock } from "../components/media-component/MediaBlock";

function Question() {
    const params = useParams();
    const [question, setQuestion] = useState<IQuestion>();
    const { loadQuestion } = useGameStore();
    const abortControllerRef = useRef<AbortController>();

    useCancellableFetch(async (signal) => {
        abortControllerRef.current = new AbortController();
        if (params.questionId) {
            loadQuestion(params.questionId, signal)
                .then((data) => {
                    setQuestion(data);
                })
                .catch(() => {
                    // TODO: добавить страницу с ошибкой c EXEPTION-01
                    // EXEPTION-01|Question 92ccb882-1351-4a87-9d2c-f3dccb246ca4 has already done for user d01fd48b-01ac-4d88-8230-25600d588894
                });
            }
    });

    return (
        <>
            Вопрос {params.questionId}
            <HeaderFirst>
                {question?.categoryName} за {question?.price}
            </HeaderFirst>
            <HeaderSecond>
                {question?.text}
            </HeaderSecond>
                <MediaBlock mediaObject={question!} />
            <Timer/>
            <LinkButton to={`answer`} label={"К ответу"} />
        </>
    );
}

export default Question;