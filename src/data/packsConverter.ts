import { IPack } from "./types";

export const convertSQLResultToPacks = (response: Array<{id: string, name: string, created_at: string, author_name: string}>): IPack[] | undefined => {
    try {    
        return response.map((item) => {
            return {
                id: item.id,
                name: item.name,
                authorName: item.author_name,
                created: new Date(item.created_at),
            }
        });

    } catch (e) {
        console.log(`convertSQLResultToPacks error: ${e}`);
        return undefined;
    }
};