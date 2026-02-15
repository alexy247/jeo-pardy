import { IPack } from "./types";

export const convertSQLResultToPacks = (response: Array<{id: number, name: string, created_at: string, username: string}>): IPack[] => {
    return response.map((item) => {
        return {
            id: item.id,
            name: item.name,
            authorName: item.username,
            created: new Date(item.created_at)
        }
    });
};