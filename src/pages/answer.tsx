import { useParams } from "react-router-dom";
import { useRef, useState } from "react";

import { IAnswer } from "../data/types";
import { useGameStore } from "../store/useGameStore";
import { useCancellableFetch } from "../hoocks/useCancellableFetch";
import { MediaBlock } from "../components/media-component/MediaBlock";
import { useHybridQuestionRealtime } from "../hoocks/useHybridQuestionRealtime";

import HeaderSecond from "../components/header/header-second/HeaderSecond";
import HeaderFirst from "../components/header/header-first/HeaderFirst";
import LinkButton from "../components/actions/LinkButton";
import CenteringHorizontal from "../components/ui/centering-horizontal-block/CenteringHorizontal";

function Answer() {
    const params = useParams();
    const [answer, setAnswer] = useState<IAnswer>();
    const { loadAnswer, currentQuestion, currentGameSession } = useGameStore();
    
    const abortControllerRef = useRef<AbortController>();

    const { openAnswer } = useHybridQuestionRealtime(currentGameSession);

    useCancellableFetch(async (signal) => {
        abortControllerRef.current = new AbortController();
        if (params.questionId) {
            const questionId = params.questionId;
            Promise.all([openAnswer(questionId), loadAnswer(questionId, signal)])
                .then((values) => {
                    if (values[0] && values[1]) {
                        setAnswer(values[1]);
                    }
                })
            }
    });

    return (
        <>
            Ответ {params.anwserId}
            {answer && 
                <>
                    <HeaderFirst>
                        {currentQuestion?.categoryName} за {currentQuestion?.price}
                    </HeaderFirst>
                    <HeaderSecond>
                        {answer?.answerText}
                    </HeaderSecond>
                    <MediaBlock mediaObject={answer!} />
                    <CenteringHorizontal>
                        <LinkButton to={`/board/${params.sessionId}/${params.roundOrder}/`} label={"К доске"} />
                    </CenteringHorizontal>
                </>
            }
        </>
    );
}

export default Answer;