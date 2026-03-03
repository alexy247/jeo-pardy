import { useParams } from "react-router-dom";

import { IQuestion } from "../data/types";
import { useRef, useState } from "react";
import { useGameStore } from "../store/useGameStore";

import HeaderSecond from "../components/header/header-second/HeaderSecond";
import HeaderFirst from "../components/header/header-first/HeaderFirst";
import Timer from "../components/timer/Timer";
import LinkButton from "../components/actions/LinkButton";

import { useCancellableFetch } from "../hoocks/useCancellableFetch";
import { AudioBlock } from "../components/ui/media/audio-block/audio-block";
import { VideoBlock } from "../components/ui/media/video-block/video-block";
import { ImageBlock } from "../components/ui/media/image-block/image-block";

function Question() {
    const params = useParams();
    const [question, setQuestion] = useState<IQuestion>();
    const { loadCurrentQuestion, isLoading, currentGameSession, setGameSession } = useGameStore();
    const abortControllerRef = useRef<AbortController>();
    
    if (params.sessionId && params.sessionId != currentGameSession) {
        console.log('Сессия в сторе отличается от сессии в ссылке');
        setGameSession(params.sessionId);
    }

    useCancellableFetch(async (signal) => {
        abortControllerRef.current = new AbortController();
        if (params.questionId) {
            loadCurrentQuestion(params.questionId, signal)
                .then((data) => {
                    setQuestion(data);
                })
                .catch(() => {
                    // TODO: добавить страницу с ошибкой c EXEPTION-01
                    // EXEPTION-01|Question 92ccb882-1351-4a87-9d2c-f3dccb246ca4 has already done for user d01fd48b-01ac-4d88-8230-25600d588894
                });
            }
    });
    
    if (isLoading) return <div>Loading question...</div>;

    const mediaComponent = () => {
        switch(question?.mediaType) {
            case 'AUDIO':
                return <AudioBlock mediaUrl={question.mediaUrl} />
            case 'VIDEO':
                return <VideoBlock mediaUrl={question.mediaUrl} />
            case 'IMAGE':
                return <ImageBlock mediaUrl={question.mediaUrl} />
            case 'TEXT':
            default:
                return <></>
        }
    };

    return (
        <>
            Вопрос {params.questionId}
            <HeaderFirst>
                {question?.categoryName} за {question?.price}
            </HeaderFirst>
            <HeaderSecond>
                {question?.text}
            </HeaderSecond>
                {mediaComponent()}
            <Timer/>
            <LinkButton to={`/board/${params.sessionId}/${params.roundOrder}/answer/${question?.answerId}`} label={"К ответу"} />
        </>
    );
}

export default Question;