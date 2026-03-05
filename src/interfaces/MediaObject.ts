export type MediaType = 'TEXT' | 'VIDEO' | 'AUDIO' | 'IMAGE';

export interface IMediaObject {
    mediaType: MediaType;
    mediaUrl: string;
}

export type MediaObject = IMediaObject;