import { ServerSoft } from 'bacon-types'
import fs from 'fs-extra'
import fetch from 'node-fetch'
import path from 'path'

import { Constants } from '../../../Constants'
import { statusEmitter } from './StatusEmitter'

class ServerSoftManager {
    private readonly Directory = path.join(Constants.DATA_PATH, 'soft')

    private readonly downloadQueue: { url: string; name?: string }[] = []

    constructor() {
        if (!fs.existsSync(this.Directory)) fs.mkdirsSync(this.Directory)
    }

    public addQueue(url: string, name: string) {
        this.downloadQueue.push({ url, name })
        if (this.downloadQueue.length === 1) this.download()
    }

    public async download() {
        const { url, name } = this.downloadQueue[0]
        const res = await fetch(url)
        const total = parseInt(res.headers.get('content-length') || '0')
        let downloaded = 0
        if (!res.body) throw new Error('No body')

        const file = path.join(this.Directory, name ?? path.basename(url))
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
        if (this.downloadQueue.length > 0) this.download()
    }

    public getSofts(): ServerSoft[] {
        return fs
            .readdirSync(this.Directory)
            .filter((file) => file.endsWith('.jar'))
            .map((file) => {
                return {
                    name: file,
                    size: fs.statSync(path.join(this.Directory, file)).size,
                }
            })
    }

    public addSoft(filePath: string, original?: string) {
        fs.copySync(filePath, path.join(this.Directory, original || path.basename(filePath)))
    }

    public deleteSoft(name: string) {
        if (!fs.existsSync(path.join(this.Directory, name))) return
        fs.unlinkSync(path.join(this.Directory, name))
    }
}

export const serverSoftManager = new ServerSoftManager()
