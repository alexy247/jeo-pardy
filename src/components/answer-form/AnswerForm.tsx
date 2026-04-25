import { FormEvent, useEffect, useRef, useState } from "react";

import { useCancellableFetch } from "../../hoocks/useCancellableFetch";
import { useGameStore } from "../../store/useGameStore";
import { useHybridQuestionRealtime } from "../../hoocks/useHybridQuestionRealtime";
import { useGame } from "../../context/GameContext";
import { IAnswer, IQuestion } from "../../data/types";

import Timer from "../timer/Timer";
import CenteringHorizontal from "../ui/centering-horizontal-block/CenteringHorizontal";
import InputField from "../ui/input-field/InputField";
import ButtonsContainer from "../ui/buttons-container/ButtonsContainer";
import ButtonType from "../actions/ButtonType";
import LinkButton from "../actions/LinkButton";
import { sendLog } from "../../lib/logger";

interface IAnswerFormProps {
    question: IQuestion;
}

const FALSE_START_SECONDS = 3;

function AnswerForm({ question }: IAnswerFormProps) {
    const { user } = useGame();
    const { currentGameSession, loadAnswer, currentQuestionStatus, updateScore } = useGameStore();
    const { disableQuestion, openQuestion } = useHybridQuestionRealtime(currentGameSession);

    const [answerButtonVisible, setAnswerButtonVisible] = useState<boolean>(false);
    const [inputVisible, setInputVisible] = useState<boolean>(false);
    const [answer, setCurrentAnswer] = useState<IAnswer>();
    const [answerEnabled, setAnswerEnabled] = useState<boolean>(false);
    const [falseStartActive, setfalseStartActive] = useState(false);
    const [firstTimerEnded, setFirstTimerEnded] = useState(false);

    const questionId = question.id;

    const ANSWER_INPUT_ID = `jeo-qid-${questionId}`;

    const abortControllerRef = useRef<AbortController>();

    const logger = (message: string) => sendLog({
        level: 'debug',
        userId: user ? user?.id : 'anonym',
        sessionId: currentGameSession,
        component: 'AnswerForm',
        message: message
    });

    useCancellableFetch(async (signal) => {
        abortControllerRef.current = new AbortController();
        if (questionId) {
            loadAnswer(questionId, signal)
                .then((res) => {
                    setCurrentAnswer(res);
                })
                .catch();
        }
    });

    const onTimerEnd = () => {
        logger('firstTimerEnd');
        setAnswerButtonVisible(true);
        setFirstTimerEnded(true);
    };

    const onAnswerButtonClick = () => {
        disableQuestion(questionId)
            .then(() => {
                logger('disableQuestion');
                setInputVisible(true);
                setAnswerButtonVisible(false);
            })
            .catch()
    };

    const onFormSubmit = async (event: FormEvent) => {
        event.stopPropagation();
        event.preventDefault();

        const formElement = event.target as HTMLElement;
        const answerEl = formElement.querySelector(`#${ANSWER_INPUT_ID}`) as HTMLInputElement;

        if (answer && answerEl.value && user) {
            const success: boolean = answer.answerText.toLocaleLowerCase() == answerEl.value.toLocaleLowerCase();
            updateScore(user, success)
                .then(() => {
                    if (success) {
                        logger('updateScore success');
                        setAnswerEnabled(true);
                        setAnswerButtonVisible(false);
                        setInputVisible(false);
                    } else {
                        logger('updateScore openQuestion');
                        openQuestion(questionId);
                        setfalseStartActive(true);
                        setAnswerButtonVisible(false);
                        setInputVisible(false);
                    }
                })
                .catch();
        
        }
    }

    useEffect(() => {
        if (answerButtonVisible && currentQuestionStatus === 'DISABLED') {
            setAnswerButtonVisible(false);
        } else if (firstTimerEnded && !falseStartActive && !inputVisible && currentQuestionStatus === 'ACTIVE') {
            setAnswerButtonVisible(true);
        }
    }, [currentQuestionStatus, answerButtonVisible, setAnswerButtonVisible]);

    useEffect(() => {
        let timerId: any;
        if (falseStartActive) {
            logger('falseStartActive');
            timerId = setTimeout(() => {
                setAnswerButtonVisible(true);
                setfalseStartActive(false);
            }, FALSE_START_SECONDS * 1000);
        }
        return () => clearTimeout(timerId);
    }, [falseStartActive]);

    return (
        <>
            <Timer callBack={onTimerEnd} />
            <CenteringHorizontal>
                {answerButtonVisible && (<ButtonType label="Ответить" type="button" onClick={onAnswerButtonClick}/>)}
                {inputVisible &&
                    <form onSubmit={onFormSubmit}>
                        <InputField id={ANSWER_INPUT_ID} label="Ответ" type="text" autofocus={true} />
                        <ButtonsContainer>
                            <ButtonType label="Сохранить" type="submit"/>
                        </ButtonsContainer>
                    </form>
                }
                {answerEnabled &&
                    <>
                        <p>Верно!</p>
                        <LinkButton to={`answer`} label={"К ответу"} />
                    </>
                }
                {falseStartActive && <>Неверно, штраф {FALSE_START_SECONDS} секунды</>}
            </CenteringHorizontal>
        </>
    );
}

export default AnswerForm;