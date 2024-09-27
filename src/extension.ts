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

    context.subscriptions.push(disposable);
}

export function deactivate() {}
