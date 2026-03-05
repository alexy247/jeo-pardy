import { MediaType } from "../interfaces/MediaObject";
import { IQuestion } from "./types";

export const convertSQLResultToQuestion = (response: Array<{question_id: string, question_text: string, media_type: MediaType, media_url: string, question_price: number, categories_name: string}>): IQuestion => {
    return {
        id: response[0].question_id,
        text: response[0].question_text,
        mediaType: response[0].media_type,
        mediaUrl: response[0].media_url,
        price: response[0].question_price,
        categoryName: response[0].categories_name
    };
}
