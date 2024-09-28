import { createHashRouter } from 'react-router-dom';

import RootLayout from './layouts/RootLayout';
import HomePage from './pages/Home';
import SettingsPage from './pages/Settings';

const router = createHashRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: '/',
                element: <HomePage />,
            },
            {
                path: '/settings',
                element: <SettingsPage />,
            },
        ],
    },
]);

export default router;
