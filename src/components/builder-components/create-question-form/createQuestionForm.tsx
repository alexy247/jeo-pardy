import { FormEvent, useState } from "react";
import { ICategory } from "../../../data/types";

import './CreateQuestionForm.css';
import IconButton from "../../ui/icon-button/IconButton";
import UlList from "../../ui/ul-list/UlList";
import ListItem from "../../ui/ul-list/list-item/ListItem";

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
    const onFormSubmit = async (event: FormEvent) => {
        event.stopPropagation();
        event.preventDefault();
    };

    const [formPage, setFormPage] = useState<FormPage>(FormPage.QUESTION);

    const headerText = formPage === FormPage.QUESTION ? 'Создать вопрос' : 'Создать ответ';

    const questionPage = (
        <div>category: {category.title}, packId: {packId}, roundId: {roundId}, price: {price}</div>
    );

    const answerPage = (
        <div>category: {category.title}, packId: {packId}, roundId: {roundId}, price: {price}</div>
    );

    const openQuestionPage = () => {
        setFormPage(FormPage.QUESTION);
    };

    const openAnswerPage = () => {
        setFormPage(FormPage.ANSWER);
    };

    return (
        <form className="create-question-form" onSubmit={onFormSubmit}>
            <h2 className="create-question-form_header">{headerText}</h2>
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
        </form>
    );
}

export default CreateQuestionForm;