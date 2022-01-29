import zip from 'adm-zip'
import fs from 'fs-extra'
import fetch from 'node-fetch'
import os from 'os'
import path from 'path'
import tar from 'tar'

import { Constants } from '../../../../Constants'
import { Logger } from '../../../../util/Logger'
import { statusEmitter } from '../StatusEmitter'
import { JavaVersion, VersionMeta } from './types'

export class JavaInstaller {
    public async install(version: JavaVersion) {
        const url = this.getDownloadLink(version)
        const ext = url.endsWith('.zip') ? '.zip' : '.tar.gz'
        const dir = path.join(Constants.DATA_PATH, 'java', version)
        if (!fs.existsSync(dir)) fs.mkdirsSync(dir)
        const file = path.join(Constants.TEMP_DIR, `jdk-${version}${ext}`)

        Logger.get().info(`Downloading ${url}...`)
        await this.downloadFile(version, file)

        Logger.get().info(`Extracting ${version}...`)
        await this.extract(file, version)

        statusEmitter.broadcast({
            key: `java.${version}`,
            title: `complete`,
        })
    }

    private downloadFile(version: JavaVersion, dest: string) {
        return new Promise<void>((resolve, reject) => {
            const url = this.getDownloadLink(version)
            const ws = fs.createWriteStream(dest)
            fetch(url).then((res) => {
                const total = parseInt(res.headers.get('content-length') || '0')
                let downloaded = 0
                if (!res.body) return reject(new Error('No body'))

                res.body.on('data', (chunk) => {
                    downloaded += chunk.length
                    statusEmitter.broadcast({
                        key: `java.${version}`,
                        title: `Downloading ${version}...`,
                        data: {
                            current: downloaded,
                            total,
                        },
                    })
                    ws.write(chunk)
                })
                res.body.on('end', () => {
                    resolve()
                })
            })
        })
    }

    private async extract(file: string, version: JavaVersion) {
        const ext = file.endsWith('.zip') ? '.zip' : '.tar.gz'
        const tmp = path.join(Constants.TEMP_DIR, `jdk-${version}`)
        statusEmitter.broadcast({
            key: `java.${version}`,
            title: `Extracting ${file}...`,
        })
        if (ext === '.zip') {
            const zipFile = new zip(file)
            zipFile.extractAllTo(tmp, true)
        } else {
            await tar.extract({
                file: file,
                cwd: tmp,
            })
        }
        const folder = fs.readdirSync(tmp).find((f) => f.startsWith('jdk'))
        if (!folder) throw new Error('No folder found')

        const dir = path.join(Constants.DATA_PATH, 'java', version)
        if (fs.existsSync(dir)) fs.removeSync(dir)
        fs.moveSync(path.join(tmp, folder), dir)
    }

    private getDownloadLink(version: JavaVersion) {
        const meta = VersionMeta[version]
        const osType = process.platform
        const osArch = os.arch()
        const osName = osType === 'win32' ? 'windows' : osType === 'darwin' ? 'macos' : osType === 'linux' ? 'linux' : 'unknown'
        const osArchName = osArch === 'x64' ? 'x64' : osArch === 'ia32' ? 'x86-32' : 'unknown'
        const ext = osType === 'win32' ? '.zip' : '.tar.gz'

        if (osName === 'unknown') throw new Error(`Unsupported OS: ${osType}`)
        if (osArchName === 'unknown') throw new Error(`Unsupported Architecture: ${osArch}`)

        const path1 = version === '8' ? `${meta.first}-${meta.last}` : `-${meta.first}+${meta.last}`
        const path2 = version === '8' ? `${meta.first}${meta.last}` : `${meta.first}_${meta.last}`

        return `https://github.com/adoptium/temurin${version}-binaries/releases/download/jdk${path1}/OpenJDK${version}U-jre_${osArchName}_${osName}_hotspot_${path2}${ext}`
    }
}
