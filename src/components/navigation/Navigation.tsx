import { Link } from "react-router-dom";
import './Navigation.css';

function Navigation() {
    return (
        <nav>
            <ul className="ul">
                <li className="li">
                    <Link to="/" title="/" className="li_link">
                        Главная
                    </Link>
                </li>
                <li className="li">
                    <Link to="/categories" title="/categories" className="li_link">
                        Категории
                    </Link>
                </li>
                <li className="li">
                    <Link to="/board" title="/board" className="li_link">
                        Доска
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;