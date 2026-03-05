import { useState } from "react";
import { useGame } from "../../context/GameContext";
import { useGameStore } from "../../store/useGameStore";

import ButtonType from "../actions/ButtonType";

import classNames from "classnames";

import './DebugInfo.css';


const DebugInfo = () => {
    const { user } = useGame();
    const { currentGameSession, currentRound, currentQuestion, currentAnswer } = useGameStore();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const clickHandler = () => {
        setIsOpen(!isOpen);
    };

    const debugInfoClasses = classNames("debug-info", {
        "__open": isOpen
    });

    return (
        <div className="debug-wrapper">
            <ButtonType label={"?"} title={"Информация для отладки"} onClick={clickHandler} />
            <div className={debugInfoClasses}>
                userEmail: {user?.email}<br/>
                gameSession: {currentGameSession}<br/>
                currentRound: {currentRound}<br/>
                {currentQuestion && `currentQuestion: ${JSON.stringify(currentQuestion)}`}<br/>
                {currentAnswer && `currentAnswer: ${JSON.stringify(currentAnswer)}`}<br/>
            </div>
        </div>
    );
};

export default DebugInfo;