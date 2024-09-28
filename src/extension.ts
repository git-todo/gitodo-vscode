import * as vscode from 'vscode';

import { createNonce } from './createNonce';
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

    updateStatusBar();

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
            vscode.window.showInformationMessage('Startin Webview');
        }

        panel.webview.html = getWebviewContent({
            scriptJs: jsScriptPath,
            styleCss: cssStylePath,
        });

        panel.webview.onDidReceiveMessage(async (msg: any) => {
            console.log('message received', msg);
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
            <link rel="stylesheet" href="${styleCss}">
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
