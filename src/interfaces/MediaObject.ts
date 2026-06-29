export enum MediaType {
    TEXT = 'TEXT',
    VIDEO = 'VIDEO',
    AUDIO = 'AUDIO',
    IMAGE = 'IMAGE',
};

export interface IMediaObject {
    mediaType: MediaType;
    mediaUrl: string;
}

export type MediaObject = IMediaObject;

export const isMediaTypeWithUrl = (mediaType: MediaType): boolean => {
    return mediaType !== MediaType.TEXT;
};

export const parseToMediaType = (value: string): MediaType => {
    switch (value) {
        case 'AUDIO':
            return MediaType.AUDIO;
        case 'VIDEO':
            return MediaType.VIDEO;
        case 'IMAGE':
            return MediaType.IMAGE;
        case 'TEXT':
        default:
            return MediaType.TEXT;
    }
};

export const labelByMediaType = (mediaType: MediaType): string => {
    switch (mediaType) {
        case MediaType.AUDIO:
            return 'Аудио';
        case MediaType.VIDEO:
            return 'Видео';
        case MediaType.IMAGE:
            return 'Картинка';
        case MediaType.TEXT:
        default:
            return 'Текст';
    }
};