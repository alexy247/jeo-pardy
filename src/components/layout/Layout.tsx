import { Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../navigation/Navigation';

import './Layout.css';

function Layout() {
    return (
        <Fragment>
            <Navigation />
            <main>
                <Outlet />
            </main>
        </Fragment>
    );
}

export default Layout;