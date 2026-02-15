import './UlList.css';

function UlList({ children }: any) {
    return (
        <ul className="ul-list">
            {children}
        </ul>
    );
}

export default UlList;