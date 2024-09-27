#!/usr/bin/env tsx

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import type { BuildContext, BuildOptions } from 'esbuild';
import esbuild from 'esbuild';

const isWatchMode = process.argv.includes('--watch');
const options: BuildOptions = {
    color: true,
    logLevel: 'info',
    entryPoints: ['src/extension.ts'],
    bundle: true,
    metafile: process.argv.includes('--metafile'),
    outdir: './out/src',
    external: ['vscode', 'typescript'],
    format: 'cjs',
    platform: 'node',
    target: 'ESNext',
    tsconfig: './src/tsconfig.json',
    sourcemap: process.argv.includes('--sourcemap'),
    minify: process.argv.includes('--minify'),
    plugins: [
        {
            name: 'umd2esm',
            setup(build) {
                build.onResolve({ filter: /^(vscode-.*|estree-walker|jsonc-parser)/ }, (args) => {
                    const pathUmdMay = require.resolve(args.path, {
                        paths: [args.resolveDir],
                    });
                    // Call twice the replace is to solve the problem of the path in Windows
                    const pathEsm = pathUmdMay
                        .replace('/umd/', '/esm/')
                        .replace('\\umd\\', '\\esm\\');
                    return { path: pathEsm };
                });
            },
        },
        {
            name: 'meta',
            setup(build) {
                build.onEnd(async (result) => {
                    if (result.metafile && result.errors.length === 0) {
                        return fs.writeFile(
                            path.resolve(__dirname, '../meta.json'),
                            JSON.stringify(result.metafile),
                        );
                    }
                });
            },
        },
    ],
};

const reactOptions: BuildOptions = {
    color: true,
    logLevel: 'info',
    sourcemap: process.argv.includes('--sourcemap'),
    entryPoints: ['src/webview/index.tsx'],
    outdir: './out/react',
    bundle: true,
    format: 'cjs',
    external: [],
    platform: 'browser',
    target: 'es2020',
    loader: { '.tsx': 'tsx', '.ts': 'ts' },
    tsconfig: './src/webview/tsconfig.json',
};

async function main() {
    let extctx: BuildContext | undefined;
    let reactctx: BuildContext | undefined;
    try {
        if (isWatchMode) {
            extctx = await esbuild.context(options);
            await extctx.watch();

            // build the React app
            reactctx = await esbuild.context(reactOptions);
            await reactctx.watch();
        } else {
            const result = await esbuild.build(options);
            if (process.argv.includes('--analyze')) {
                const chunksTree = await esbuild.analyzeMetafile(result.metafile!, { color: true });
                console.log(chunksTree);
            }
        }
    } catch (error) {
        console.error(error);
        extctx?.dispose();
        reactctx?.dispose();
        process.exit(1);
    }
}

main();
