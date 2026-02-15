import { ICategory, IRound } from "./types";

export const convertSQLResultToRounds = (response: {categories_name: string[], id: string[], round_order_num: number[], rounds_name: string[]}): IRound[] => {
    const {categories_name, id, round_order_num, rounds_name} = response;
    try {
    let roundsResult: IRound[] = [];
        round_order_num.forEach((item, index) => {
            const sameRoundItem = roundsResult.find((resItem) => {
                    return resItem.roundOrder == item;
            });
            if (sameRoundItem) {
                const newCategory: ICategory = {
                    id: id[index],
                    title: categories_name[index],
                };
                sameRoundItem.categories.push(newCategory);
            } else {
                const newCategory: ICategory = {
                    id: id[index],
                    title: categories_name[index],
                };
                const newRound: IRound = {
                    roundOrder: item,
                    roundName: rounds_name[index],
                    categories: [newCategory],
                };
                roundsResult.push(newRound);
            }
        });
        return roundsResult.sort((a, b) => a.roundOrder - b.roundOrder);
    } catch {
        console.log(`convertSQLResultToCategories error`);
        return [];
    }
}