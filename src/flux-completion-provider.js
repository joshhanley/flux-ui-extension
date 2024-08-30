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

        const prefixMatch = linePrefix.match(/<(?:f(?:l(?:u(?:x)?)?)?)?$/)

        // Handle component name completion when the line ends with '<'
        if (prefixMatch) {
            const fluxComponents = loadFluxComponents() // Load components from JSON file

            // Map each component object to a CompletionItem
            return fluxComponents.map((component) => {
                const item = new vscode.CompletionItem(`flux:${component.name}`, vscode.CompletionItemKind.Snippet)

                if (component.selfClosing) {
                    item.insertText = new vscode.SnippetString(`flux:${component.name}/>$0`)
                } else {
                    item.insertText = new vscode.SnippetString(`flux:${component.name}>$0</flux:${component.name}>`)
                }

                item.documentation = new vscode.MarkdownString(`Inserts a Flux ${component.name} component.`)
                return item
            })
        }

        // Handle prop completion when typing inside a component tag
        const tagMatch = linePrefix.match(/<flux:([a-z0-9\.\-]+)\s+[^>]*$/)

        if (tagMatch) {
            const fluxComponents = loadFluxComponents() // Load components from JSON file
            const componentName = tagMatch[1]

            // Find the corresponding component and its props
            const component = fluxComponents.find((c) => c.name === componentName)
            if (component && component.props) {
                return component.props.map((prop) => {
                    const item = new vscode.CompletionItem(prop.name, vscode.CompletionItemKind.Property)

                    if (prop.default === 'true' || prop.default === 'false') {
                        if (prop.type === 'boolean' && prop.default === 'false') {
                            item.insertText = new vscode.SnippetString(`${prop.name}`)
                        } else {
                            item.insertText = new vscode.SnippetString(`:${prop.name}="\${1:${prop.default}}"`)
                        }
                    } else if (prop.default === "Value from 'wire:model'" || prop.default === 'null') {
                        item.insertText = new vscode.SnippetString(`${prop.name}="$0"`)
                    } else {
                        item.insertText = new vscode.SnippetString(`${prop.name}="\${1:${prop.default.slice(1, -1)}}"`)
                    }

                    const documentation = `**Name**: ${prop.name}  \n**Default**: ${prop.default}  \n**Type**: ${prop.type}`

                    item.documentation = new vscode.MarkdownString(documentation)
                    return item
                })
            }
        }

        return undefined
    }
}

module.exports = FluxCompletionProvider
