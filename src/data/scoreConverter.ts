export const convertSQLResultToScore = (response: Array<{score: number}>): number | undefined => {
    try {
        return response[0].score;
    } catch (e) {
        console.log(`convertSQLResultToScore error: ${e}`);
        return undefined;
    }
}