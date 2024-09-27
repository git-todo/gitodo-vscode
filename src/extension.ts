import * as vscode from 'vscode';

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
            'gitodoWebview', // Internal ID for the webview
            'Gitodo', // Title of the webview panel
            vscode.ViewColumn.One, // Show in the first editor tab
            {}, // Webview options
        );

        // Set the HTML content of the webview
        panel.webview.html = getWebviewContent();
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
            const logMessage = `Line ${thisLineNumber + 1} contains a TODO`;
            vscode.window.showInformationMessage(logMessage);
        }
    };

    vscode.window.onDidChangeTextEditorSelection(() => {
        todoCheck();
    });

    context.subscriptions.push(disposable, openWebviewCommand);
}

function getWebviewContent(): string {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Gitodo Extension</title>
        </head>
        <body>
            <h1>Welcome to Gitodo</h1>
            
        </body>
        </html>
    `;
}

export function deactivate() {}
