const vscode = require('vscode')
const path = require('path')
const fs = require('fs')

// Function to load components from the JSON file
function loadFluxComponents() {
    const filePath = path.join(__dirname, 'components.json')
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
}

class FluxCompletionProvider {
    provideCompletionItems(document, position, token, context) {
        const linePrefix = document.lineAt(position).text.substr(0, position.character)

        // Trigger only when the line ends with '<'
        if (!linePrefix.trim().endsWith('<')) {
            return undefined
        }

        const fluxComponents = loadFluxComponents() // Load components from JSON file

        // Map each component object to a CompletionItem
        return fluxComponents.map((component) => {
            const item = new vscode.CompletionItem(component.name, vscode.CompletionItemKind.Snippet)

            if (component.selfClosing) {
                item.insertText = new vscode.SnippetString(`${component.name} $0/>`)
            } else {
                item.insertText = new vscode.SnippetString(`${component.name}>$0</${component.name}>`)
            }

            item.documentation = new vscode.MarkdownString(`Inserts a Flux ${component.name.split(':')[1]} component.`)
            return item
        })
    }
}

module.exports = FluxCompletionProvider
