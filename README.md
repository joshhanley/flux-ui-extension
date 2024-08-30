# Flux UI extension

This package is a VSCode extension to add suggestions for [Flux UI components](https://fluxui.dev/) (created by Caleb Porzio).

## Usage

In any blade file, start a HTML tag `<` and you should see a list of Flux components suggested.

![screenshot of component suggestions](https://github.com/joshhanley/flux-ui-extension/blob/main/images/compoenents-screenshot.png?raw=true)

Once a Flux component has been added, you can also see what props are available.

![screenshot of prop suggestions](https://github.com/joshhanley/flux-ui-extension/blob/main/images/compoenents-screenshot.png?raw=true)

## Contributions

This extension needs to be manually updated if any Flux components are added or removed.

To update the components in this extension from Flux, you need to ensure you have a local copy of Flux and run the following command:

```bash
npm run update /path/to/flux
```

Locally this extension will then remember you path to Flux, so you can just run `npm run update` in the future.

Once updated, a new version of the extension will need to be published.
