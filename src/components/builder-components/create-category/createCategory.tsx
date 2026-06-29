import { FormEvent } from "react";
import { ICategory } from "../../../data/types";

import './createCategory.css';

const NEW_CATEGORY_NAME_ID = `new-category-name-id`;

interface ICreateCategoryProps {
    currentPackId?: string;
    currentRoundId: number;
    createCategory: (name: string) => Promise<ICategory | undefined>;
    addToMap: (packId: string, roundId: number, item: ICategory) => void;
}

const CreateCategory = ( { currentPackId, currentRoundId, createCategory, addToMap }: ICreateCategoryProps ) => {
    const onFormSubmit = async (event: FormEvent) => {
        event.stopPropagation();
        event.preventDefault();

        const formElement = event.target as HTMLElement;
        const categoryNameEl = formElement.querySelector(`#${NEW_CATEGORY_NAME_ID}`) as HTMLInputElement;

        if (categoryNameEl && categoryNameEl.value) {
            createCategory(categoryNameEl.value)
                .then((category) => {
                    if (category && currentPackId) {
                        addToMap(currentPackId, currentRoundId, category);
                    }
                })
                .catch((res) => {
                    console.log(res);
                });
        }
    };

    return (
        <form className="new-category-form" onSubmit={onFormSubmit}>
            <input id={NEW_CATEGORY_NAME_ID} className="new-category-input" type="text" placeholder="Добавить категорию" title="Добавить категорию" />
        </form>
    );
};

export default CreateCategory;