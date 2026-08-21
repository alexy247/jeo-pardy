import './ButtonsContainer.css';

interface IButtonsContainerProps {
    children: React.ReactNode;
    isVerticalAlign?: boolean;
}

function ButtonsContainer({ children, isVerticalAlign = false }: IButtonsContainerProps) {
    return (
        <div className={`container ${isVerticalAlign ? '__vertical' : ''}`}>
            {children}
        </div>
    );
};

export default ButtonsContainer;