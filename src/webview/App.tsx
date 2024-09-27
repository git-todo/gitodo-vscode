import type { ReactElement } from 'react';

import Input from './components/Input';

function App(): ReactElement {
    return (
        <div className="flex flex-col">
            <Input placeholder="Demo" />
            <Input placeholder="Demo2" />
            <Input placeholder="Demo3" />
        </div>
    );
}

export default App;
