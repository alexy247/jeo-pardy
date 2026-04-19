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

import { useHybridQuestionRealtime } from "../hoocks/useHybridQuestionRealtime";

function Question() {
    const params = useParams();
    const [question, setQuestion] = useState<IQuestion>();
    const { loadQuestion, currentGameSession } = useGameStore();
    
    const abortControllerRef = useRef<AbortController>();

    const { openQuestion } = useHybridQuestionRealtime(currentGameSession);

    useCancellableFetch(async (signal) => {
        abortControllerRef.current = new AbortController();
        if (params.questionId) {
            const questionId = params.questionId;
            Promise.all([openQuestion(questionId), loadQuestion(questionId, signal)])
                .then((values) => {
                    if (values[0] && values[1]) {
                        setQuestion(values[1]);
                    }
                });
        }
    });

    return (
        <>
            Вопрос {params.questionId},
            {question &&
                <>
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
            }
        </>
    );
}

export default Question;