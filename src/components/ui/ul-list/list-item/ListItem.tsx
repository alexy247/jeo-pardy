import './ListItem.css';

function ListItem({ children }: any) {
    return (
        <li className="item">
            {children}
        </li>
    );
}

export default ListItem;