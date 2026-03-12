import { Link, useParams } from "react-router-dom";

import './Navigation.css';

function Navigation() {
    const params = useParams();

    return (
        <nav>
            <ul className="ul">
                <li className="li">
                    <Link to="/" title="Главная" className="li_link">
                        Главная
                    </Link>
                </li>
                <li className="li">
                    <Link to="/categories" title="Категории" className="li_link">
                        Категории
                    </Link>
                </li>
                {
                    params.sessionId && params.roundOrder && (
                    <li className="li">
                        <Link to={`/board/${params.sessionId}/${params.roundOrder}/`} title="Доска" className="li_link">
                            Доска
                        </Link>
                    </li>
                    )
                }
            </ul>
        </nav>
    );
};

export default Navigation;