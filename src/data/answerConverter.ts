import { MediaType } from "../interfaces/MediaObject";
import { IAnswer } from "./types";

export const convertSQLResultToAnswer = (response: Array<{answer_id: string, answer_text: string, media_type: MediaType, media_url: string}>): IAnswer | undefined => {
    try {
        return {
            id: response[0].answer_id,
            answerText: response[0].answer_text,
            mediaType: response[0].media_type,
            mediaUrl: response[0].media_url,
        };
    } catch (e) {
        console.log(`convertSQLResultToAnswer error: ${e}`);
        return undefined;
    }
}
