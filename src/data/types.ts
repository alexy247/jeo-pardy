import { IMediaObject } from "../interfaces/MediaObject";

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

export type QuestionStatus = 'INITIAL' | 'ACTIVE' | 'FINISHED';

export interface IBoardItem {
    questionId: string;
    questionStatus: QuestionStatus;
    price: number;
}

export interface IBoardRound {
    roundName: RoundName;
    categoriesNames: CategoryName[];
    rows: Map<CategoryName, IBoardItem[]>;
}

export type QuestionId = string;

export interface IQuestion extends IMediaObject {
    id: QuestionId;
    text: string;
    price: number;
    categoryName: CategoryName;
}

export type AnswerId = string;

export interface IAnswer extends IMediaObject {
    id: AnswerId;
    answerText: string;
}
