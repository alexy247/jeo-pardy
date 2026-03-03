import { SessionId } from "./types";

export const convertSQLResultToSessionId = (response: {id: string, author_id: string, name: string, started_at: string, game_status: string, pack_id: number}): SessionId => {
    return response.id;
}