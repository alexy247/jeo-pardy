import './CenteringBlock.css';

function CenteringBlock({ children }: any) {
    return (
        <div className="center">
            {children}
        </div>
    );
};

export default CenteringBlock;