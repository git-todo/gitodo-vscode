# vscode extension boilerplate

## Roadmap

> These are just for POC

[X] - inline anottation in editor for a todo
[x] - hover for a todo
[x] - React app for extension UI (webview)
[x] - Feed in data from external API to the webview
[x] - handle `git` within the extension context
[] - handle persistable extension config

## Features

- github actions support publish extension to both vs marketplace and open vsx
- auto generate changelog and publish github release, make sure you enabled the write permission of github actions
- pnpm/eslint/prettier/ling-staged/simple-git-hooks/stale-dep
- use esbuild to bundle extension

## Setup

After fork this repository and clone it to local, run:

```bash
cd <your-extension-directory>
npx setup-boilerplate
```

You can also just skip this step and adjust the boilerplate by yourself.

## Development

Install dependencies by:

```shell
pnpm install
```

Then run and debug extension like in [official documentation](https://code.visualstudio.com/api/get-started/your-first-extension)

## Publish

You need set two github actions secrets:

- VS_MARKETPLACE_TOKEN: [Visual Studio Marketplace token](https://learn.microsoft.com/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate)
- OPEN_VSX_TOKEN: [Open VSX Registry token](https://github.com/eclipse/openvsx/wiki/Publishing-Extensions#3-create-an-access-token)

```shell
pnpm release
```
