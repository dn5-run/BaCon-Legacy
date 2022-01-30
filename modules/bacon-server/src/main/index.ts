import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';



import { Constants } from './Constants';
import { Core } from './core';


export const isDev = process.env.NODE_ENV === 'development'

const program = new Command()
export const args = program
    .option('-p, --port <number>', 'port to listen on', parseInt)
    .option('--disable-startup', 'disables automatic server startup.')
    .parse(process.argv)
    .opts()


const main = async () => {
    checkPath()
    Core.init()
}
const checkPath = () => {
    const essentialDirs = [Constants.DATA_PATH, Constants.TEMP_DIR, path.join(Constants.DATA_PATH, 'database')]
    for (const dir of essentialDirs) {
        if (!fs.existsSync(dir)) fs.mkdirsSync(dir)
    }
}
main()
