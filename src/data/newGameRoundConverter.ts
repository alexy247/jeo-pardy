import { INewBoardRow, ICategory, INewBoard } from "./types";

export const convertSQLResultToNewGameRound = (response: Array<{round_name: string, category_id: string, category_name: string, question_id: string, question_price: number, round_order_num: number }>): INewBoard => {
    let roundName: string = "";
    let categories: ICategory[] = [];
    let rows: INewBoardRow = new Map();

    response.forEach((item) => {
        if (roundName != item.round_name) {
            roundName = item.round_name;
        }

        if (!categories.find((c) => c.id === item.category_id)) {
            categories.push({
                id: item.category_id,
                title: item.category_name
            });
        }

        if (rows.has(item.category_id)) {
            const currentRow = rows.get(item.category_id)!;
            currentRow.push({
                    questionId: item.question_id,
                    questionStatus: 'INITIAL',
                    price: item.question_price
            });
            rows.set(item.category_id, currentRow);
        } else {
            rows.set(item.category_id, [{
                questionId: item.question_id,
                    questionStatus: 'INITIAL',
                    price: item.question_price
            }]);
        }
        
    });

    return {
        roundName: roundName,
        categories: categories,
        rows: rows,
    };
};