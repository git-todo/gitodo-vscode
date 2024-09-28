import { createHashRouter } from 'react-router-dom';

import RootLayout from './layouts/RootLayout';
import SettingsPage from './pages/Settings';

const router = createHashRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: '/',
                element: <h1>Home</h1>,
            },
            {
                path: '/settings',
                element: <SettingsPage />,
            },
        ],
    },
]);

export default router;
