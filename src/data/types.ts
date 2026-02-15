export interface IPack {
    id: number,
    name: string,
    authorName: string,
    created: Date,
}

export interface ICategory {
    id: string,
    title: string,
}

export type SessionId = string;

export interface IRound {
    roundOrder: number,
    roundName: string,
    categories: ICategory[],
}