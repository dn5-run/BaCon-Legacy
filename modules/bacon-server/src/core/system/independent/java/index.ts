import { spawnSync } from 'child_process'
import fs from 'fs-extra'
import path from 'path'

import { Constants } from '../../../../Constants'
import { JavaInstaller } from './installer'
import { JavaVersion } from './types'

class Java {
    private readonly JavaDir = path.join(Constants.DATA_PATH, 'java')

    private readonly installer = new JavaInstaller()

    public async init() {
        if (!fs.existsSync(this.JavaDir)) fs.mkdirsSync(this.JavaDir)
        await this.checkJavas()
    }

    public getJava(version: JavaVersion = '17') {
        return this.getBin(path.join(this.JavaDir, version))
    }

    private async checkJavas() {
        const javas = fs.readdirSync(this.JavaDir)
        const installTasks = []
        for (const v of ['8', '11', '17'] as JavaVersion[]) {
            if (!javas.includes(v)) {
                installTasks.push(this.installer.installTask(v))
                continue
            }
            try {
                const bin = this.getBin(path.join(this.JavaDir, v))
                this.getVersion(bin)
            } catch (error) {
                installTasks.push(this.installer.installTask(v))
            }
        }
        await Promise.all(installTasks)
    }

    public getBin(dir: string) {
        const ext = process.platform === 'win32' ? '.exe' : ''
        return process.platform === 'darwin' ? path.join(dir, 'Contents', 'Home', 'bin', 'java' + ext) : path.join(dir, 'bin', 'java' + ext)
    }

    public getVersion(path: string) {
        if (!fs.existsSync(path)) throw new Error(`Java not found at ${path}`)
        const ps = spawnSync(path, ['-version'])
        const data = ps.stderr.toString()
        const javaVersion = new RegExp('java version|openjdk version').test(data) ? data.split(/ |\n/)[2].replace(/"/g, '') : false
        if (javaVersion) {
            return javaVersion
        } else {
            throw new Error('Could not detect Java version')
        }
    }
}
export const javaManager = new Java()
