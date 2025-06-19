import './Timer.css';

interface ITimerProps {
    durationSec?: number;
}

function Timer({ durationSec = 5}: ITimerProps) {
    return (
        <div className="timer">
            <div className="timer-line" style={{ animationDuration: `${durationSec}s` }}></div>
        </div>
    );
}

export default Timer;