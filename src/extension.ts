import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Plugin activated');

    const disposable = vscode.commands.registerCommand('gitodo-test.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        vscode.window.showInformationMessage(
            'Hello World from Awesome VSCode Extension Boilerplate!',
        );
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
