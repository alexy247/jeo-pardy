import { useModal } from "@patch-kit/modal";

import { ICategory } from "../../../data/types";

import IconButton from "../../ui/icon-button/iconButton";
import CreateQuestionForm from "../create-question-form/createQuestionForm";

interface IEditQuestionProps {
    category: ICategory;
    packId: string;
    roundId: number;
    price: number;
    onSuccess: () => Promise<void>;
}

const EditQuestion = ({ category, packId, roundId, price, onSuccess }: IEditQuestionProps) => {
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
        <IconButton iconName="pen-icon" onClick={handleOpenModal} title={`Редактировать вопрос в категории ${category.title}`} />
    );
}

export default EditQuestion;