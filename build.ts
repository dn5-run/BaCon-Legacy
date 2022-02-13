import { execSync } from 'child_process'
import fs from 'fs-extra'
import path from 'path'

/**
 * Build server
 */

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')).toString())
const args = process.argv.slice(2)

if (args.includes('--clean')) fs.existsSync('./dist') && fs.removeSync('./dist')

const compile = () => {
    execSync('yarn tsc', { cwd: path.join(__dirname, 'modules', 'bacon-types'), stdio: 'inherit' })
    execSync('yarn tsc', { cwd: path.join(__dirname, 'modules', 'bacon-client'), stdio: 'inherit' })
}

const build = () => {
    execSync('yarn tsc --outDir ../../dist/server', { cwd: path.join(__dirname, 'modules', 'bacon-server'), stdio: 'inherit' })
    execSync(`yarn webpack --mode production --output-path ../../dist/web`, {
        cwd: path.join(__dirname, 'modules', 'bacon-browser'),
        stdio: 'inherit',
    })
    execSync(`yarn pkg .`, { stdio: 'inherit' })
}

if (args[0])
    switch (args[0]) {
        case 'compile':
            compile()
            break
        case 'build':
            compile()
            build()
            break
    }
else {
    console.log('Usage: node build.ts [compile|build]')
}
