import './video-block.css';

interface IVideoBlockProps {
    mediaUrl: string;
}

export const VideoBlock = ({ mediaUrl }: IVideoBlockProps) => {
    return (
        <div className='video-wrapper'>
            {/* Без muted автоплей не работает */}
            <video controls autoPlay={true} loop muted className='video'>
                <source src={mediaUrl} type="video/mp4"></source>
                Ваш браузер не поддерживает видео.
            </video>
        </div>
    );
};