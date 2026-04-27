import { IPlayerWithScore } from "./types";

export const convertSQLResultToPlayersWithScore = (response: Array<{email: string, username?: string, avatar_url?: string, score: number}>): IPlayerWithScore[] | undefined => {
    try {
        return response.map((item) => {
            return {
                email: item.email,
                nausernameme: item.username,
                avatarUrl: item.avatar_url,
                score: item.score
            }
        });
    } catch (e) {
        console.log(`convertSQLResultToPlayersWithScore error: ${e}`);
        return undefined;
    }
}