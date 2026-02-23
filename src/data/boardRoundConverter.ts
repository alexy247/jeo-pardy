import { CategoryName, IBoardItem, IBoardRound } from "./types";

export const convertSQLResultToBoardRound = (response: Array<{round_name: string, category_name: string, question_id: string, question_price: number, round_order_num: number, finished: boolean}>): IBoardRound => {
    let roundName: string = "";
    let categoriesNames: CategoryName[] = [];
    let rows: Map<CategoryName, IBoardItem[]> = new Map();

    response.forEach((item) => {
        if (roundName != item.round_name) {
            roundName = item.round_name;
        }

        if (!categoriesNames) {
            categoriesNames = [item.category_name];
        } else {
            categoriesNames.push(item.category_name);
        }

        if (rows.has(item.category_name)) {
            const currentRow = rows.get(item.category_name)!;
            currentRow.push({
                    questionId: item.question_id,
                    finished: item.finished,
                    price: item.question_price
            });
            rows.set(item.category_name, currentRow);
        } else {
            rows.set(item.category_name, [{
                questionId: item.question_id,
                    finished: item.finished,
                    price: item.question_price
            }]);
        }
        
    });

    return {
        roundName: roundName,
        categoriesNames: categoriesNames,
        rows: rows,
    };
};