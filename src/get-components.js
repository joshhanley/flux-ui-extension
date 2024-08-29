const fs = require('fs')
const path = require('path')

let outputFile = 'src/components.json'
let fluxDirectoryConfig = 'flux-directory.json'

let fluxDirectory = process.argv[2]

if (fluxDirectory) {
    fs.writeFileSync(fluxDirectoryConfig, JSON.stringify(fluxDirectory))
} else {
    if (fs.existsSync(fluxDirectoryConfig)) {
        fluxDirectory = JSON.parse(fs.readFileSync(fluxDirectoryConfig))
    } else {
        console.warn('WARN: No Flux directory argument provided or previously stored.')
        return
    }
}

console.log(`Scanning Flux directory: ${fluxDirectory}`)

function isBladeFile(filePath) {
    return path.extname(filePath) === '.php' && filePath.endsWith('.blade.php')
}

function getFilesRecursively(directory, localPath = null) {
    let results = []
    const list = fs.readdirSync(directory)

    list.forEach((file) => {
        const filePath = path.join(directory, file)
        const stat = fs.statSync(filePath)

        if (stat && stat.isDirectory()) {
            results = results.concat(getFilesRecursively(filePath, localPath ? `${localPath}.${file}` : file))
        } else {
            if (!filePath.endsWith('.blade.php')) {
                return
            }

            let componentName = file.replace(/\.blade\.php$/, '')

            let fullComponentName = componentName === 'index' ? localPath : `${localPath ? `${localPath}.` : ''}${componentName}`

            results.push({
                name: fullComponentName,
                selfClosing: false,
            })
        }
    })

    return results
}

const files = getFilesRecursively(fluxDirectory + '/stubs/resources/views/flux')

fs.writeFileSync(outputFile, JSON.stringify(files, null, 2))

console.log(`Components have been updated in: ${outputFile}`)
