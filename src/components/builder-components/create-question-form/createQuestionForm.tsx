import { FormEvent, useRef, useState } from "react";
import { ICategory } from "../../../data/types";
import { isMediaTypeWithUrl, labelByMediaType, MediaType, parseToMediaType } from "../../../interfaces/MediaObject";
import { useCreateGameStore } from "../../../store/useCreateGameStore";

import IconButton from "../../ui/icon-button/iconButton";
import UlList from "../../ui/ul-list/UlList";
import ListItem from "../../ui/ul-list/list-item/ListItem";
import InputField from "../../ui/input-field/InputField";
import RadioInputField from "../../ui/radio-input-field/RadioInputField";
import ButtonType from "../../actions/ButtonType";

import './CreateQuestionForm.css';

interface ICreateQuestionProps {
    category: ICategory;
    packId: string;
    roundId: number;
    price: number;
    closeModal: () => void;
}

enum FormPage {
    'QUESTION' = 1,
    'ANSWER' = 2,
}

const CreateQuestionForm = ({ category, packId, roundId, price, closeModal }: ICreateQuestionProps) => {
    const { createQuestion } = useCreateGameStore();

    const [formPage, setFormPage] = useState<FormPage>(FormPage.QUESTION);
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
        <div>category: {category.title}, packId: {packId}, roundId: {roundId}, price: {price}
                <InputField ref={questionTextRef}
                            type="text"
                            label="Текст вопроса"
                            isWide
                            required
                />
                <div className="create-question-form_radio-block">
                    {Object.values(MediaType).map((mediaType) => (
                        <RadioInputField
                            name="question-media-type"
                            value={mediaType}
                            label={labelByMediaType(mediaType)}
                            checked={mediaType === questionMediaType}
                            onChange={onMediaTypeQuestionChange}
                        />
                    ))}
                </div>
                {isMediaTypeWithUrl(questionMediaType) && 
                    <InputField ref={questionMediaUrlRef}
                                type="text"
                                label="Ссылка на медиа"
                                isWide
                    />
                }
        </div>
    );

    const answerPage = (
        <div>category: {category.title}, packId: {packId}, roundId: {roundId}, price: {price}
                <InputField ref={answerTextRef}
                            type="text"
                            label="Текст ответа"
                            isWide
                            required
                />
                <div className="create-question-form_radio-block">
                    {Object.values(MediaType).map((mediaType) => (
                        <RadioInputField
                            name="answer-media-type"
                            value={mediaType}
                            label={labelByMediaType(mediaType)}
                            checked={mediaType === answerMediaType}
                            onChange={onMediaTypeAnswerChange}
                        />
                    ))}
                </div>
                {isMediaTypeWithUrl(answerMediaType) && 
                    <InputField ref={answerMediaUrlRef}
                                type="text"
                                label="Ссылка на медиа"
                                isWide
                    />
                }
        </div>
    );

    const openQuestionPage = () => {
        setFormPage(FormPage.QUESTION);
    };

    const openAnswerPage = () => {
        setFormPage(FormPage.ANSWER);
    };

    const onFormSubmit = (event: FormEvent) => {
        event.stopPropagation();
        event.preventDefault();

        const questionTextValue = questionTextRef.current?.value;
        const questionMediaUrlValue = questionMediaUrlRef.current?.value;

        const answerTextValue = answerTextRef.current?.value;
        const answerMediaUrlValue = answerMediaUrlRef.current?.value;

        if (questionTextValue && answerTextValue) {
            createQuestion(category.id, price, packId, roundId, questionTextValue, questionMediaType, answerTextValue, answerMediaType, questionMediaUrlValue, answerMediaUrlValue)
                .then((success) => success && closeModal())
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
            <UlList size="small" isWitoutPadding>
                <ListItem key="question" isActive={formPage === FormPage.QUESTION} isHorizontal>
                    <button className="page-change-button" onClick={() => openQuestionPage()}>
                        Вопрос
                    </button>
                </ListItem>
                <ListItem key="answer" isActive={formPage === FormPage.ANSWER} isHorizontal>
                    <button className="page-change-button" onClick={() => openAnswerPage()}>
                        Ответ
                    </button>
                </ListItem>
            </UlList>
            {formPage === FormPage.QUESTION ? questionPage : answerPage}
            <IconButton className="close-button" size="20" iconName="close-icon" title="Закрыть" onClick={closeModal} />
            {error && <p>{error}</p>}
            <ButtonType className="submit-button" label="Сохранить" type="submit"/>
        </form>
    );
}

export default CreateQuestionForm;