import { format } from 'date-fns';

import { shortenCommitHash } from './githash';

export interface Todo {
    id: number | string;
    todo: string;
    commitHash: string;
    createdAt: Date;
}

// note: icons are from: https://microsoft.github.io/vscode-codicons/dist/codicon.html

export function createMarkDown({ id, commitHash, createdAt, todo }: Todo): string {
    const date = format(createdAt, 'yyyy-MM-dd HH:mm');
    const link = 'https://github.com';
    const todoMarkdown = `
<div style="padding: 8px;">
$(git-commit)<code data-id="${id}">${shortenCommitHash(commitHash)}</code>
<p>$(calendar) Created at: ${date}</p>
<code style="background: #444">${todo}</code>
<p>$(link) Link: <a href="${link}">open</a></p>
</div>
    `;
    return todoMarkdown;
}
