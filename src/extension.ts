import * as vscode from 'vscode';

import { createNonce } from './createNonce';

export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Gitodo Plugin activated');

    const disposable = vscode.commands.registerCommand('gitodo-test.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
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

        // Set the HTML content of the webview
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
        const editor = vscode.window.activeTextEditor;

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

    vscode.window.onDidChangeTextEditorSelection(() => {
        todoCheck();
    });

    context.subscriptions.push(disposable, openWebviewCommand);
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
