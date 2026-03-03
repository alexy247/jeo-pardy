import { ICategory, IRound } from "./types";

export const convertSQLResultToRounds = (response: Array<{category_id: string, category_name: string, round_name: string, round_order_num: number}>): IRound[] => {
    let result: IRound[] = [];
    try {
        response.forEach((item) => {
            const sameRoundItem = result.find((resItem) => {
                return resItem.roundOrder == item.round_order_num;
            });

            if (sameRoundItem) {
                    const newCategory: ICategory = {
                        id: item.category_id,
                        title: item.category_name,
                    };
                    sameRoundItem.categories.push(newCategory);
                } else {
                    const newCategory: ICategory = {
                        id: item.category_id,
                        title: item.category_name,
                    };
                    const newRound: IRound = {
                        roundOrder: item.round_order_num,
                        roundName: item.round_name,
                        categories: [newCategory],
                    };
                    result.push(newRound);
                }
        });
        return result;
    } catch (e) {
        console.log(`convertSQLResultToCategories error: ${e}`);
        return [];
    }
}