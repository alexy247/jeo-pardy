import { MediaType } from "../interfaces/MediaObject";
import { IQuestion } from "./types";

export const convertSQLResultToQuestion = (response: {question_id: string, question_text: string, media_type: MediaType, media_url: string, question_price: number, categories_name: string}): IQuestion | undefined => {
    try {
        return {
            id: response.question_id,
            text: response.question_text,
            mediaType: response.media_type,
            mediaUrl: response.media_url,
            price: response.question_price,
            categoryName: response.categories_name
        };
    } catch (e) {
        console.log(`convertSQLResultToQuestion error: ${e}`);
        return undefined;
    }
}