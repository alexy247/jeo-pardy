import { useModal } from "@patch-kit/modal";

import { ICategory } from "../../../data/types";

import IconButton from "../../ui/icon-button/iconButton";
import CreateQuestionForm from "../create-question-form/createQuestionForm";

interface ICreateQuestionProps {
    category: ICategory;
    packId: string;
    roundId: number;
    price: number;
    onSuccess: () => Promise<void>;
}

const CreateQuestion = ({ category, packId, roundId, price, onSuccess }: ICreateQuestionProps) => {
    const { showModal, closeModal } = useModal();

    const handleSuccess = async () => {
        closeModal();
        await onSuccess();
    };

    const handleOpenModal = () => {
        showModal(
            <CreateQuestionForm category={category} packId={packId} roundId={roundId} price={price} closeModal={closeModal} onSuccess={handleSuccess} />,
            { closeOnOutsideClick: true }
        );
    };

    return (
        <IconButton iconName="question-icon" onClick={handleOpenModal} title={`Добавить вопрос в категорию ${category.title}`} />
    );
}

export default CreateQuestion;