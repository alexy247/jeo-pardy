// import { MediaObject } from "../../interfaces/MediaObject";
import { AudioBlock } from "../ui/media/audio-block/audio-block";
import { ImageBlock } from "../ui/media/image-block/image-block";
import { VideoBlock } from "../ui/media/video-block/video-block";

export const MediaBlock = (mediaObject: any) => {
    switch(mediaObject.mediaType) {
        case 'AUDIO':
            return <AudioBlock mediaUrl={mediaObject.mediaUrl} />
        case 'VIDEO':
            return <VideoBlock mediaUrl={mediaObject.mediaUrl} />
        case 'IMAGE':
            return <ImageBlock mediaUrl={mediaObject.mediaUrl} />
        case 'TEXT':
        default:
            return <></>
    }
};