import { FormEvent, useRef, useState } from "react";
import { ICategory } from "../../../data/types";
import { isMediaTypeWithUrl, labelByMediaType, MediaType, parseToMediaType } from "../../../interfaces/MediaObject";
import { useCreateGameStore } from "../../../store/useCreateGameStore";

import IconButton from "../../ui/icon-button/iconButton";
import InputField from "../../ui/input-field/InputField";
import RadioInputField from "../../ui/radio-input-field/RadioInputField";
import ButtonType from "../../actions/ButtonType";
import Tabs from "../../tabs/Tabs";

import './CreateQuestionForm.css';

interface ICreateQuestionProps {
    category: ICategory;
    packId: string;
    roundId: number;
    price: number;
    closeModal: () => void;
    onSuccess: () => Promise<void>;
}

const CreateQuestionForm = ({ category, packId, roundId, price, closeModal, onSuccess }: ICreateQuestionProps) => {
    const { createQuestion } = useCreateGameStore();

    const [questionMediaType, setQuestionMediaType] = useState<MediaType>(MediaType.TEXT);
    const [answerMediaType, setAnswerMediaType] = useState<MediaType>(MediaType.TEXT);
    const [error, setError] = useState<string | null>(null);

    const onMediaTypeQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuestionMediaType(parseToMediaType(event.target.value));
    };

    const onMediaTypeAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAnswerMediaType(parseToMediaType(event.target.value));
    };

    const questionTextRef = useRef<HTMLInputElement>(null);
    const questionMediaUrlRef = useRef<HTMLInputElement>(null);

    const answerTextRef = useRef<HTMLInputElement>(null);
    const answerMediaUrlRef = useRef<HTMLInputElement>(null);

    const questionPage = (
        <div>
            <InputField ref={questionTextRef}
                        type="text"
                        label="Текст вопроса"
                        isWide
                        autofocus
            />
            <div className="create-question-form_radio-block">
                {Object.values(MediaType).map((mediaType) => (
                    <RadioInputField
                        key={mediaType}
                        name="question-media-type"
                        value={mediaType}
                        label={labelByMediaType(mediaType)}
                        checked={mediaType === questionMediaType}
                        onChange={onMediaTypeQuestionChange}
                    />
                ))}
            </div>
            <div className={`create-question-form_media-url-block ${isMediaTypeWithUrl(questionMediaType) ? '__visible' : '__hidden'}`}>
                <InputField ref={questionMediaUrlRef}
                            type="text"
                            label="Ссылка на медиа"
                            isWide
                />
            </div>
        </div>
    );

    const answerPage = (
        <div>
            <InputField ref={answerTextRef}
                        type="text"
                        label="Текст ответа"
                        isWide
            />
            <div className="create-question-form_radio-block">
                {Object.values(MediaType).map((mediaType) => (
                    <RadioInputField
                        key={mediaType}
                        name="answer-media-type"
                        value={mediaType}
                        label={labelByMediaType(mediaType)}
                        checked={mediaType === answerMediaType}
                        onChange={onMediaTypeAnswerChange}
                    />
                ))}
            </div>
            <div className={`create-question-form_media-url-block ${isMediaTypeWithUrl(answerMediaType) ? '__visible' : '__hidden'}`}>
                <InputField ref={answerMediaUrlRef}
                            type="text"
                            label="Ссылка на медиа"
                            isWide
                />
            </div>
        </div>
    );

    const onFormSubmit = async (event: FormEvent) => {
        event.stopPropagation();
        event.preventDefault();

        const questionTextValue = questionTextRef.current?.value;
        const questionMediaUrlValue = questionMediaUrlRef.current?.value;

        const answerTextValue = answerTextRef.current?.value;
        const answerMediaUrlValue = answerMediaUrlRef.current?.value;

        if (questionTextValue && answerTextValue) {
            createQuestion(category.id, price, packId, roundId, questionTextValue, questionMediaType, answerTextValue, answerMediaType, questionMediaUrlValue, answerMediaUrlValue)
                .then((success) => {
                    if (success) {
                        closeModal();
                        onSuccess();
                    }
                })
                .catch((err) => {
                    setError(err.message);
                });
        }
    };

    return (
        <form className="create-question-form" onSubmit={onFormSubmit}>
            <h2 className="create-question-form_header">
                Создать вопрос за {price}
            </h2>
            <div>
                category: {category.title}, packId: {packId}, roundId: {roundId}, price: {price}
            </div>
            <Tabs titles={['Вопрос', 'Ответ']} keys={['question', 'answer']}>
                {questionPage}
                {answerPage}
            </Tabs>
            <IconButton className="close-button" size="20" iconName="close-icon" title="Закрыть" onClick={() => closeModal()} />
            {error && <p>{error}</p>}
            <ButtonType className="submit-button" label="Сохранить" type="submit"/>
        </form>
    );
}

export default CreateQuestionForm;