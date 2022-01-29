import fs from 'fs-extra'
import path from 'path'

import { Constants } from './Constants'
import { Core } from './core'

export const isDev = process.env.NODE_ENV === 'development'

const main = async () => {
    checkPath()

    Core.init()
}

const checkPath = () => {
    const essentialDirs = [Constants.DATA_PATH, Constants.TEMP_DIR, path.join(Constants.DATA_PATH, 'database')]

    essentialDirs.forEach((dir) => {
        if (!fs.existsSync(dir)) fs.mkdirsSync(dir)
    })
}

main()
