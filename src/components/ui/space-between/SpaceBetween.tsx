import './SpaceBetween.css';

const SpaceBetween = ({ children }: any) => {
    return (
        <div className="justify-content">
            {children}
        </div>
    );
}

export default SpaceBetween;