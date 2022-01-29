import { Actions, ArgumentTypes, ClientToServerEvents, MinecraftServerType, ServerToClientEvents } from 'bacon-types'
import { io, Socket } from 'socket.io-client'

import { fetch } from '../util/fetch'
import { Server } from './Server'

export class Client {
    public socket: Socket<ServerToClientEvents, ClientToServerEvents>

    public readonly httpAddress: string
    public readonly ip: string
    public readonly port: number

    private _isAuthorized = false
    private _token: string | null = null
    public get isAuthorized() {
        return this._isAuthorized
    }
    public get token() {
        return this._token
    }

    constructor(address: string, port?: number, ssl?: boolean) {
        this.httpAddress = `${ssl ? 'https' : 'http'}://${address}${port ? `:${port}` : ''}`
        this.ip = address
        this.port = port || (ssl ? 443 : 80)

        this.socket = io(this.httpAddress)
    }

    public close() {
        this.socket.close()
    }

    public async login(username: string, password: string) {
        const res = await fetch(`${this.httpAddress}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }),
        })
        if (res.status === 200) await this.auth()
        else throw new Error('Invalid username or password')
    }

    public async logout() {
        const res = await fetch(`${this.httpAddress}/api/auth/logout`)
        this.socket.close()
        if (res.status === 200) this._isAuthorized = false
        else throw new Error(await res.text())
    }

    public auth() {
        this.socket.connect()

        return new Promise<void>((resolve, reject) => {
            this.socket.emit('auth')
            this.socket.once('auth', (success) => {
                if (success) {
                    this._isAuthorized = true
                    resolve()
                } else {
                    this.socket.close()
                    reject(new Error('Invalid token'))
                }
            })
        })
    }

    public action<A extends keyof Actions>(action: A, ...args: ArgumentTypes<Actions[A]>) {
        return new Promise<ReturnType<Actions[A]>>((resolve, reject) => {
            const handler: ServerToClientEvents['action'] = (returnedAction, value) => {
                if ((returnedAction as string) === action) {
                    if (!value.result) reject(value.error)
                    else resolve(value.data as ReturnType<Actions[A]>)

                    this.socket.removeListener('action', handler)
                }
            }
            this.socket.on('action', handler)
            this.socket.emit('action', action, args)
        })
    }

    public getStatus() {
        return this.action('GET_STATUS')
    }

    public createServer(config: MinecraftServerType) {
        return this.action('MINECRAFT_SERVER_CREATE', config)
    }

    public deleteServer(name: string) {
        return this.action('MINECRAFT_SERVER_DELETE', name)
    }

    public async getServers() {
        const configs = await this.action('MINECRAFT_SERVER_LIST')
        return configs.map((config) => new Server(config, this))
    }

    public async getServer(name: string) {
        const config = await this.action('MINECRAFT_SERVER_GET', name)
        return new Server(config, this)
    }

    public downloadServerSoft(url: string, name: string) {
        return this.action('MINECRAFT_SOFT_DOWNLOAD', url, name)
    }
    public getServerSofts() {
        return this.action('MINECRAFT_SOFT_GET')
    }
    public deleteServerSoft(name: string) {
        return this.action('MINECRAFT_SOFT_DELETE', name)
    }
}

export { Server } from './Server'
