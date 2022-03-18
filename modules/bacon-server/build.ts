import { build } from 'esbuild'

build({
    entryPoints: ['./src/index.ts'],
    outdir: '../../dist/server',
    bundle: true,
    platform: 'node',
    external: ['esbuild', 'fsevents', 'vite', 'rollup', 'pidusage'],
    watch: false,
    sourcemap: true,
})
