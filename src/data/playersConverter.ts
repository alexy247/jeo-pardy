import { IPlayer } from "./types";

export const convertSQLResultToPlayers = (response: Array<{email: string, username?: string, avatar_url?: string}>): IPlayer[] | undefined => {
    try {
        return response.map((item) => {
            return {
                email: item.email,
                nausernameme: item.username,
                avatarUrl: item.avatar_url,
            }
        });
    } catch (e) {
        console.log(`convertSQLResultToPlayers error: ${e}`);
        return undefined;
    }
}