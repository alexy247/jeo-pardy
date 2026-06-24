import { useModal } from "@patch-kit/modal";

import { ICategory } from "../../../data/types";

import IconButton from "../../ui/icon-button/IconButton";
import CreateQuestionForm from "../create-question-form/createQuestionForm";

import './CreateQuestion.css';

interface ICreateQuestionProps {
    category: ICategory;
    packId: string;
    roundId: number;
    price: number;
}

const CreateQuestion = ({ category, packId, roundId, price }: ICreateQuestionProps) => {
    const { showModal, closeModal } = useModal();

    const handleOpenModal = () => {
        showModal(
            <CreateQuestionForm category={category} packId={packId} roundId={roundId} price={price} closeModal={closeModal} />,
            { closeOnOutsideClick: true }
        );
    };

    return (
        <IconButton iconName="question-icon" onClick={handleOpenModal} title={`Добавить вопрос в категорию ${category.title}`} />
    );
}

export default CreateQuestion;