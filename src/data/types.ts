export interface IPack {
    id: number,
    name: string,
    authorName: string,
    created: Date,
}

export type SessionId = string;

export type CategoryName = string;

export interface ICategory {
    id: string,
    title: CategoryName,
}

export type RoundName = string;

export interface IRound {
    roundOrder: number,
    roundName: RoundName,
    categories: ICategory[],
}

export interface IBoardItem {
    questionId: string;
    finished: boolean;
    price: number;
}

export interface IBoardRound {
    roundName: RoundName;
    categoriesNames: CategoryName[];
    rows: Map<CategoryName, IBoardItem[]>;
}