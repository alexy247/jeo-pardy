import { ICreatePackResult, PackId } from "./types";

export const convertSQLResultCreatePackToData = (response: Array<{pack_id: PackId, round_id: number }>): ICreatePackResult => {
    return {
        packId: response[0].pack_id,
        roundId: response[0].round_id,
    };
}