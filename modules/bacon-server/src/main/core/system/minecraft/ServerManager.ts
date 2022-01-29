import { MinecraftServerType } from 'bacon-types'
import { JsonDB } from 'node-json-db'
import path from 'path'

import { Core } from '../..'
import { isDev } from '../../..'
import { Constants } from '../../../Constants'
import { javaManager } from '../Independent/Java'
import { serverSoftManager } from '../Independent/ServerSoftManager'
import { Server } from './Server'

export class ServerManager {
    private readonly db = new JsonDB(path.join(Constants.DATA_PATH, 'database', 'server'), true, isDev)
    private readonly servers: Server[] = []

    constructor(private readonly _core: Core) {
        if (!this.db.exists('/servers')) this.db.push('/servers', [])

        this.db.getObject<MinecraftServerType[]>('/servers').forEach((v) => this.servers.push(new Server(v)))
        this.startUp()
    }

    private async startUp() {
        this._core.updateStatus('initialize-java')
        await javaManager.init()
        this._core.updateStatus('startup-server')
        await Promise.all(this.servers.filter((server) => server.autoStart).map((server) => server.start()))
        this._core.updateStatus('online')
    }

    public createServer(config: MinecraftServerType) {
        if (this.getServer(config.name)) throw new Error(`Server ${config.name} already exists`)
        if (!serverSoftManager.getSofts().includes(config.soft)) throw new Error(`Server soft ${config.soft} does not exists`)
        if (config.name.match(/#/)) throw new Error(`Server name ${config.name} contains characters that cannot be used.`)
        const server = new Server(config)
        this.servers.push(server)
        this.db.push('/servers[]', server.getConfig())
    }

    public getServer(name: string) {
        return this.servers.find((server) => server.name === name)
    }

    public getServers = () => this.servers

    public deleteServer(name: string) {
        const server = this.getServer(name)
        if (!server) throw new Error(`Server ${name} does not exists`)
        this.servers.splice(this.servers.indexOf(server), 1)
        this.db.delete(`/servers[${this.servers.indexOf(server)}]`)
    }

    public updateDataBase() {
        this.db.push(
            '/servers',
            this.servers.map((server) => server.getConfig()),
        )
    }
}
