import { execSync, spawn } from 'child_process'
import { Command } from 'commander'
import fs from 'fs-extra'
import path from 'path'

const yarn = `yarn${process.platform === 'win32' ? '.cmd' : ''}`

const program = new Command()
program.name('bacon').description('bacon build script').version('1.0.0')

program
    .command('dev')
    .description('Run dn5.run in development mode')
    .action(() => {
        spawn(yarn, ['dev'], { cwd: './modules/bacon-server', stdio: 'inherit', env: { NODE_ENV: 'development' } })
    })

type BuildOptions = {
    clean: boolean
    pack: boolean
}

const buildTasks = (cwd: string, cmd: string, dist: string, clean = false) => {
    return new Promise<void>((resolve, reject) => {
        clean && fs.existsSync(path.join(cwd, dist)) && fs.removeSync(path.join(cwd, dist))
        const ps = spawn(yarn, [...cmd.split(' ')], { cwd, stdio: 'inherit' })
        ps.on('close', () => resolve())
        ps.on('error', (err) => reject(err))
    })
}

program
    .command('build')
    .description('Build dn5.run')
    .option('--clean', 'Clean build directory')
    .option('--no-pack', 'Do not pack the build')
    .action(async (options: BuildOptions) => {
        options.clean && fs.existsSync('./dist') && fs.removeSync('./dist')
        // essentials
        await buildTasks('./modules/bacon-types', 'tsc', 'dist', options.clean)
        await buildTasks('./modules/bacon-client', 'tsc', 'dist', options.clean)
        const tasks: Promise<void>[] = []
        tasks.push(buildTasks('./modules/bacon-server', 'tsc --outDir ../../dist/server', '../../dist/server', options.clean))
        tasks.push(buildTasks('./modules/bacon-front', 'vite build --outDir ../../dist/web', '../../dist/server', options.clean))
        await Promise.all(tasks)
        options.pack && execSync(`yarn pkg .`, { stdio: 'inherit' })
    })

program.parse()
