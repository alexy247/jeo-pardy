import './image-block.css';

interface IImageBlockProps {
    mediaUrl: string;
}

export const ImageBlock = ({ mediaUrl }: IImageBlockProps) => {
    return (
        <div className='image-wrapper'>
            <img src={mediaUrl} className='image'></img>
        </div>
    );
};