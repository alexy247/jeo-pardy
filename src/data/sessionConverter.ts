import { SessionId } from "./types";

export const convertSQLResultToSessionId = (response: {id: string, user_id: string, score: number, started_at: string, game_status: string, pack_id: number}): SessionId => {
    return response.id;
}