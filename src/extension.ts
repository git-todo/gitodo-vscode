import * as vscode from 'vscode';

import { fetchApi } from './api';
import { createNonce } from './createNonce';
import type { GitExtensionAPI } from './types/git';
import type { Todo } from './utils/markdown';
import { createMarkDown } from './utils/markdown';

const DEMO_TODO: Todo[] = [
    {
        id: '1',
        commitHash: '273963e738871b927d5b8274c3b3119722356bfe',
        createdAt: new Date(),
        todo: `store results in Redux`,
    },
];

export function activate(context: vscode.ExtensionContext) {
    const settings = vscode.workspace.getConfiguration('gitodo');
    if (!settings.get('enable')) {
        // TODO: i am not sure if this is the right way to handle if the extension is disabled
        vscode.window.showInformationMessage('Gitodo is disabled');
        return;
    }
    // set up statusbar item
    const gitodoStatusbarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100,
    );

    const editor = vscode.window.activeTextEditor;

    gitodoStatusbarItem.text = `$(zap) Gitodo Active`;

    // gitodoStatusbarItem.show();

    const updateStatusBar = () => {
        if (!editor) {
            return;
        } else {
            // const fileName = editor.document.fileName.split('/').pop();
            gitodoStatusbarItem.text = `$(checklist) Gitodo: ${DEMO_TODO.length} todos`;
        }
        gitodoStatusbarItem.show();
    };

    const handleGitRepository = () => {
        const gitExtension: vscode.Extension<GitExtensionAPI> =
            vscode.extensions.getExtension('vscode.git')!;
        if (!gitExtension) {
            vscode.window.showErrorMessage('Git extension not found!');
            return;
        }

        gitExtension.activate().then(() => {
            const gitAPI = gitExtension.exports.getAPI(1);
            const repositories = gitAPI.repositories;
            if (repositories.length === 0) {
                vscode.window.showInformationMessage('No Git repository found in the workspace.');
                return;
            }

            const repo = repositories[0];
            console.log('repo', repo);
            vscode.window.showInformationMessage(`Git repository found: ${repo.state.HEAD?.name}`);

            const remote =
                repo.state.remotes.find((r) => r.name === 'origin') || repo.state.remotes[0];

            if (remote) {
                vscode.window.showInformationMessage(`Remote URL: ${remote.fetchUrl}`);
            } else {
                vscode.window.showInformationMessage('No remotes found in the repository.');
            }
        });
    };

    updateStatusBar();
    setTimeout(() => {
        handleGitRepository(); // need to wait a bit, otherwise it did not work
    }, 1000);

    const disposable = vscode.commands.registerCommand('gitodo-test.helloWorld', () => {
        vscode.window.showInformationMessage(
            `${new Date().toLocaleTimeString()} Hello World from Gitodo!`,
        );
    });

    const openWebviewCommand = vscode.commands.registerCommand('gitodo-test.openWebview', () => {
        const panel = vscode.window.createWebviewPanel(
            'gitodoWebview',
            'Gitodo',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
            },
        );

        const jsScriptPath = panel.webview.asWebviewUri(
            vscode.Uri.joinPath(context.extensionUri, 'out', 'react', 'index.js'),
        );

        if (!jsScriptPath) {
            vscode.window.showErrorMessage('No Js File Found');
        }

        const cssStylePath = panel.webview.asWebviewUri(
            vscode.Uri.joinPath(context.extensionUri, 'out', 'react', 'output.css'),
        );

        if (!cssStylePath) {
            vscode.window.showErrorMessage('No CSS File Found');
        }

        if (jsScriptPath && cssStylePath) {
            vscode.window.showInformationMessage('Starting Webview');
        }

        fetchApi().then((data) => {
            vscode.window.showInformationMessage('Data fetched');
            panel.webview.postMessage({
                type: 'apiData',
                data,
            });
        });

        panel.webview.html = getWebviewContent({
            scriptJs: jsScriptPath,
            styleCss: cssStylePath,
        });

        // this handles messages from the webview
        panel.webview.onDidReceiveMessage(async (msg: any) => {
            switch (msg.command) {
                case 'startup':
                    console.log('message received', msg);
                    break;
            }
        });
    });

    const todoCheck = () => {
        if (!editor) {
            return;
        }
        const document = editor.document;
        const selection = editor.selection;

        // get the linke where the cursor is
        const thisLineText = document.lineAt(selection.active.line).text;
        const thisLineNumber = selection.active.line;

        // chec if this line contains a todo
        if (thisLineText.includes('TODO') || thisLineText.includes('todo')) {
            const logMessage = `Line ${thisLineNumber + 1} contains a TODO ${new Date().toLocaleTimeString()}`;
            vscode.window.showInformationMessage(logMessage);
        }
    };

    let decorationType: vscode.TextEditorDecorationType | undefined;

    const showGitodoDecoration = () => {
        const document = editor?.document;
        if (!editor || !document) {
            return;
        }

        // Clear any previous decorations
        if (decorationType) {
            editor.setDecorations(decorationType, []);
        }

        decorationType = vscode.window.createTextEditorDecorationType({
            after: {
                contentText: `TODO ${new Date().toLocaleTimeString()}`,
                color: 'gray',
                fontStyle: 'italic',
                margin: '0 0 0 1em',
            },
        });

        const selection = editor.selection;
        const thisLineText = document.lineAt(selection.active.line).text;
        if (thisLineText.includes('TODO') || thisLineText.includes('todo')) {
            const currentLine = editor.selection.active.line;
            const range = new vscode.Range(
                document.lineAt(currentLine).range.end,
                document.lineAt(currentLine).range.end,
            );
            editor.setDecorations(decorationType, [range]);
        } else {
            editor.setDecorations(decorationType, []);
        }
    };

    // Register the hover provider
    const todoHoverProvider = vscode.languages.registerHoverProvider('*', {
        provideHover(document, position) {
            const lineText = document.lineAt(position).text;

            if (lineText.includes('TODO') || lineText.includes('todo')) {
                // Return a hover message
                const markDown = new vscode.MarkdownString(createMarkDown(DEMO_TODO[0]));
                markDown.supportHtml = true;
                markDown.isTrusted = true;
                markDown.supportThemeIcons = true;
                return new vscode.Hover(markDown);
            }

            return null;
        },
    });

    vscode.window.onDidChangeTextEditorSelection(() => {
        todoCheck();
        showGitodoDecoration();
        updateStatusBar();
        handleGitRepository();
    });

    context.subscriptions.push(disposable, openWebviewCommand, todoHoverProvider);
}

function getWebviewContent({
    scriptJs,
    styleCss,
}: {
    scriptJs: vscode.Uri;
    styleCss: vscode.Uri;
}): string {
    const nonce = createNonce();
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Gitodo Extension</title>
            <link nonce="${nonce}" rel="stylesheet" href="${styleCss}">
        </head>
        <body>
            <div id="root"></div>
            <script>
                const vscode = acquireVsCodeApi();
                window.onload = function() {
                    vscode.postMessage({ command: 'startup' });
                };
            </script>
            <script nonce="${nonce}" src="${scriptJs}"></script>
        </body>
        </html>
    `;
}

export function deactivate() {}
