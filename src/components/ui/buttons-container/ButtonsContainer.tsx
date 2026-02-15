import './ButtonsContainer.css';

function ButtonsContainer({ children }: any) {
    return (
        <div className='container'>
            {children}
        </div>
    );
};

export default ButtonsContainer;