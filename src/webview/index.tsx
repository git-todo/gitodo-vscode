import type { ReactElement } from "react"
import React from "react"
import { createRoot } from 'react-dom/client';

const App = (): ReactElement => {
    return <div>Hello World</div>
}

const container = document.querySelector('#root');
if (!container) {
    throw new Error('No root element found');
}

const root = createRoot(container!);
root.render(<App />);

