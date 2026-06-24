import { FormEvent } from "react";

import IconButton from "../../ui/icon-button/IconButton";

interface IDeleteCategoryProps {
    categoryId: string;
    currentPackId?: string;
    currentRoundId: number;
    deleteCategory: (categoryId: string) => Promise<boolean | undefined>;
    removeFromMap: (packId: string, roundId: number, categoryId: string) => void;
}

const DeleteCategory = ({ categoryId, currentPackId, currentRoundId, deleteCategory, removeFromMap }: IDeleteCategoryProps) => {
    const onButtonClick = (event: FormEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        event.preventDefault();

        deleteCategory(categoryId)
            .then((success) => {
                if (success && currentPackId) {
                    removeFromMap(currentPackId, currentRoundId, categoryId);
                }
            })
            .catch((res) => {
                console.log(res);
            });
    };
    return (
        <IconButton iconName="close-icon" title="Удалить категорию" onClick={onButtonClick} />
    );
};

export default DeleteCategory;