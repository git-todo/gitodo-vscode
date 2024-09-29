import type { ReactElement } from 'react';
import { Link, Outlet } from 'react-router-dom';

function RootLayout(): ReactElement {
    return (
        <main className="p-3">
            <nav className="border-b py-3 flex gap-2">
                <Link className="uppercase" to="/">
                    Home
                </Link>
                <Link className="uppercase" to="/settings">
                    Settings
                </Link>
            </nav>
            <div className="mt-2">
                <Outlet />
            </div>
        </main>
    );
}

export default RootLayout;