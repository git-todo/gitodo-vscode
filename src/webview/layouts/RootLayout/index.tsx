import type { ReactElement } from 'react';
import { Link, Outlet } from 'react-router-dom';

function RootLayout(): ReactElement {
    return (
        <main>
            <h1>Layout</h1>
            <nav>
                <Link to="/settings">Settings</Link>
            </nav>
            <div>
                <Outlet />
            </div>
        </main>
    );
}

export default RootLayout;
