import fs from 'fs-extra'
import fetch from 'node-fetch'
import path from 'path'

import { statusEmitter } from '../futures/status-emitter'

class FileDownloader {
    public async download(url: string, name: string, dest: string) {
        const res = await fetch(url)
        const total = parseInt(res.headers.get('content-length') || '0')
        let downloaded = 0
        if (!res.body) throw new Error('No body')

        const file = path.join(dest, name ?? path.basename(url))
        const ws = fs.createWriteStream(file)
        res.body.on('data', (chunk) => {
            downloaded += chunk.length
            statusEmitter.broadcast({
                key: `download.${name}`,
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
            key: `download.${name}`,
            title: `complete`,
        })
    }
}

export const fileDownloader = new FileDownloader()
