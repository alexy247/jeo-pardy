import './audio-block.css';
import iconPath from '/src/res/speaker_ico.svg';

interface IAudioBlockProps {
    mediaUrl: string;
}

export const AudioBlock = ({ mediaUrl }: IAudioBlockProps) => {
    return (
        <div className='audio-wrapper'>
            <img src={iconPath} className='audio-icon' alt='Icon_Speaker'></img>
            <audio controls autoPlay={true} loop muted className='audio'>
                <source src={mediaUrl} type="audio/mp3"></source>
                Ваш браузер не поддерживает встроенное аудио.
            </audio>    
        </div>
    );
};