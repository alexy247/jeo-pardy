import { FormEvent, useRef } from "react";
import { ICategory } from "../../../data/types";

import './createCategory.css';

interface ICreateCategoryProps {
    currentPackId?: string;
    currentRoundId: number;
    createCategory: (name: string) => Promise<ICategory | undefined>;
    addToMap: (packId: string, roundId: number, item: ICategory) => void;
    onSuccess: () => Promise<void>;
}

const CreateCategory = ( { currentPackId, currentRoundId, createCategory, addToMap, onSuccess }: ICreateCategoryProps ) => {
    const categoryRef = useRef<HTMLInputElement>(null);

    const onFormSubmit = async (event: FormEvent) => {
        event.stopPropagation();
        event.preventDefault();

        const categoryName = categoryRef.current?.value;

        if (categoryName) {
            createCategory(categoryName)
                .then((category) => {
                    if (category && currentPackId) {
                        addToMap(currentPackId, currentRoundId, category);
                        return onSuccess();
                    }
                })
                .catch((res) => {
                    console.log(res);
                });
        }
    };

    return (
        <form className="new-category-form" onSubmit={onFormSubmit}>
            <input ref={categoryRef} className="new-category-input" name="Добавить категорию" type="text" placeholder="Добавить категорию" title="Добавить категорию" />
        </form>
    );
};

export default CreateCategory;