import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import router from './router';

function handleMessage(event: MessageEvent) {
    const message = event.data;
    console.log('react message received', message);
}

function App(): ReactElement {
    useEffect(() => {
        window.addEventListener('message', (event) => handleMessage(event));

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);
    return <RouterProvider router={router} />;
}

export default App;
