import type { ReactElement } from 'react';

import Input from '../../components/Input';

function SettingsPage(): ReactElement {
    return (
        <div>
            <h2>Settings Page</h2>
            <Input placeholder="Token" />
        </div>
    );
}

export default SettingsPage;
