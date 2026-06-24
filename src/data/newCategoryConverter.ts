import { ICategory } from "./types";

export const convertSQLResultToNewCategory = (response: Array<{category_id: string, category_name: string}>): ICategory | undefined => {
    try {
        return {
            id: response[0].category_id,
            title: response[0].category_name
        }
    } catch (e) {
        console.log(`convertSQLResultToNewCategory error: ${e}`);
        return undefined;
    }
}