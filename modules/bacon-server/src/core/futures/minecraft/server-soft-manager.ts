import { ServerSoft } from 'bacon-types'
import fs from 'fs-extra'
import fetch from 'node-fetch'
import path from 'path'

import { Constants } from '../../../constants'
import { fileDownloader } from '../../utils/file-downloader'
import { statusEmitter } from '../status-emitter'

class ServerSoftManager {
    private readonly directory = path.join(Constants.DATA_PATH, 'soft')

    private readonly downloadQueue: { url: string; name?: string }[] = []

    constructor() {
        if (!fs.existsSync(this.directory)) fs.mkdirsSync(this.directory)
    }

    public download(url: string, name: string) {
        fileDownloader.download(url, name, this.directory)
        // this.downloadQueue.push({ url, name })
        // if (this.downloadQueue.length === 1) this.download()
    }

    public async handle() {
        const { url, name } = this.downloadQueue[0]
        const res = await fetch(url)
        const total = parseInt(res.headers.get('content-length') || '0')
        let downloaded = 0
        if (!res.body) throw new Error('No body')

        const file = path.join(this.directory, name ?? path.basename(url))
        const ws = fs.createWriteStream(file)
        res.body.on('data', (chunk) => {
            downloaded += chunk.length
            statusEmitter.broadcast({
                key: `soft.${name}`,
                title: `Downloading ${name}...`,
                data: {
                    current: downloaded,
                    total,
                },
            })
            ws.write(chunk)
        })
        await new Promise<void>((resolve) =>
            res.body.on('end', () => {
                ws.end()
                resolve()
            }),
        )

        statusEmitter.broadcast({
            key: `soft.${name}`,
            title: `complete`,
        })
        this.downloadQueue.shift()
        if (this.downloadQueue.length > 0) this.handle()
    }

    public getSofts(): ServerSoft[] {
        return fs
            .readdirSync(this.directory)
            .filter((file) => file.endsWith('.jar'))
            .map((file) => {
                return {
                    name: file,
                    size: fs.statSync(path.join(this.directory, file)).size,
                }
            })
    }

    public addSoft(filePath: string, original?: string) {
        fs.copySync(filePath, path.join(this.directory, original || path.basename(filePath)))
    }

    public deleteSoft(name: string) {
        if (!fs.existsSync(path.join(this.directory, name))) return
        fs.unlinkSync(path.join(this.directory, name))
    }
}

export const serverSoftManager = new ServerSoftManager()
