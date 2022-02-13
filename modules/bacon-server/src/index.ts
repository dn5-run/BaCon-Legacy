import { Command } from 'commander'
import fs from 'fs-extra'
import path from 'path'

import { Constants } from './Constants'
import { Core } from './core'
import { Logger } from './util/Logger'

export const isDev = process.env.NODE_ENV === 'development'

type Arguments = {
    port?: number
    ssl?: boolean
    disableStartup?: boolean
}
const program = new Command()
export const args = program
    .option('-p, --port <number>', 'port to listen on', parseInt)
    .option('--ssl', 'use ssl')
    .option('--disable-startup', 'disables automatic server startup.')
    .parse(process.argv)
    .opts() as Arguments

const essentialDirs = [Constants.DATA_PATH, Constants.TEMP_DIR, path.join(Constants.DATA_PATH, 'database')]
for (const dir of essentialDirs) {
    if (!fs.existsSync(dir)) fs.mkdirsSync(dir)
}
Core.init()

const exitHandler = async () => {
    Logger.get().info('Shutting down...')
    await Core.instance.exit()
    Logger.get().info('Shutdown complete.')

    process.exit(0)
}

;['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'].forEach(function (
    sig,
) {
    process.on(sig, exitHandler)
})
