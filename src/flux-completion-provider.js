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

        const prefixMatch = linePrefix.match(/<(?:f(?:l(?:u(?:x(?::)?)?)?)?)?$/)

        // Handle component name completion when the line ends with '<'
        if (prefixMatch) {
            const fluxComponents = loadFluxComponents() // Load components from JSON file

            // Map each component object to a CompletionItem
            return fluxComponents.map((component) => {
                const item = new vscode.CompletionItem(`flux:${component.name}`, vscode.CompletionItemKind.Snippet)

                if (component.selfClosing) {
                    item.insertText = new vscode.SnippetString(`flux:${component.name} $0/>`)
                } else {
                    item.insertText = new vscode.SnippetString(`flux:${component.name}>$0</flux:${component.name}>`)
                }

                item.documentation = new vscode.MarkdownString(`Inserts a Flux ${component.name} component.`)
                return item
            })
        }

        return undefined
    }
}

module.exports = FluxCompletionProvider
