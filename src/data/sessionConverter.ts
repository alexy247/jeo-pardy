import { SessionData } from "./types";

export const convertSQLResultToSessionData = (response: {id: string, author_id: string, name: string, started_at: string, game_status: string, pack_id: number}): SessionData => {
    return {
        id: response.id,
        name: response.name,
    };
}