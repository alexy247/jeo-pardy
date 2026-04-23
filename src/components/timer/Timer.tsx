import { useEffect } from 'react';
import './Timer.css';

interface ITimerProps {
    durationSec?: number;
    callBack: () => void;
}

function Timer({ durationSec = 5, callBack }: ITimerProps) {
    useEffect(() => {
        const timerId = setTimeout(callBack, durationSec * 1000);
        console.log(`timerId: ${timerId}`);

        // Очистка при ре-рендере или демонтировании
        return () => {
            console.log(`clearTimeout timerId: ${timerId}`);
            clearTimeout(timerId);
        }
    }, []);

    return (
        <div className="timer">
            <div className="timer-line" style={{ animationDuration: `${durationSec}s` }}></div>
        </div>
    );
}

export default Timer;