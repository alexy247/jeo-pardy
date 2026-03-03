import { IQuestion, MediaType } from "./types";

export const convertSQLResultToQuestion = (response: Array<{question_id: string, question_text: string, media_type: MediaType, media_url: string, question_price: number, categories_name: string, answer_id: string}>): IQuestion => {
    return {
        id: response[0].question_id,
        text: response[0].question_text,
        mediaType: response[0].media_type,
        mediaUrl: response[0].media_url,
        price: response[0].question_price,
        answerId: response[0].answer_id,
        categoryName: response[0].categories_name
    };
}
