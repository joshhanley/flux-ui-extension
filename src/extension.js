// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')
const FluxCompletionProvider = require('./flux-completion-provider')

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Livewire Flux UI extension activated!')

    const provider = vscode.languages.registerCompletionItemProvider(
        'blade',
        new FluxCompletionProvider(),
        '<',
        'f',
        'l',
        'u',
        'x',
        ':', // Add characters to trigger the dropdown for "<flux:"
        ' ' // Add a space to trigger the dropdown for props inside a component tag
    )
    context.subscriptions.push(provider)
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate,
}
