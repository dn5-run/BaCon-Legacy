import { MinecraftServerType, ServerProperties, ServerSoft, ServerType } from 'bacon-types'
import EventEmitter from 'eventemitter3'
import StrictEventEmitter from 'strict-event-emitter-types'

import { Client } from '.'

type Events = {
    log: string
    preStart: void
    start: void
    stop: void
}

export class Server extends (EventEmitter as new () => StrictEventEmitter<EventEmitter, Events>) {
    public name: string

    public type: ServerType
    public dir: string
    public soft: ServerSoft
    public port: number

    public java?: string
    public maxMemory: number
    public minMemory: number
    public customJVMArgs: string
    public customServerArgs: string

    public autoStart: boolean

    constructor(config: MinecraftServerType, private readonly client: Client) {
        super()

        this.name = config.name
        this.type = config.type
        this.dir = config.dir
        this.soft = config.soft
        this.port = config.port
        this.java = config.java
        this.maxMemory = config.maxMemory
        this.minMemory = config.minMemory
        this.customJVMArgs = config.customJVMArgs ?? ''
        this.customServerArgs = config.customServerArgs ?? ''
        this.autoStart = config.autoStart

        this.client.socket.on('status', (status) => {
            if (status.key.match(new RegExp(`server.${this.name}.(stdout|stderr)`))) {
                this.emit('log', status.title)
            }
        })
    }

    public getConfig(): MinecraftServerType {
        return {
            name: this.name,
            type: this.type,
            dir: this.dir,
            soft: this.soft,
            port: this.port,
            java: this.java,
            maxMemory: this.maxMemory,
            minMemory: this.minMemory,
            customJVMArgs: this.customJVMArgs,
            customServerArgs: this.customServerArgs,
            autoStart: this.autoStart,
        }
    }

    public async updateConfig(config: Partial<MinecraftServerType>) {
        await this.client.action('MINECRAFT_SERVER_UPDATE', this.name, config)

        this.name = config.name ?? this.name
        this.type = config.type ?? this.type
        this.dir = config.dir ?? this.dir
        this.soft = config.soft ?? this.soft
        this.port = config.port ?? this.port
        this.java = config.java ?? this.java
        this.maxMemory = config.maxMemory ?? this.maxMemory
        this.minMemory = config.minMemory ?? this.minMemory
        this.customJVMArgs = config.customJVMArgs ?? this.customJVMArgs
        this.customServerArgs = config.customServerArgs ?? this.customServerArgs
        this.autoStart = config.autoStart ?? this.autoStart
    }

    public async start() {
        this.emit('preStart')
        await this.client.action('MINECRAFT_SERVER_START', this.name)
        this.emit('start')
    }

    public async stop() {
        this.emit('stop')
        await this.client.action('MINECRAFT_SERVER_STOP', this.name)
    }

    public async command(command: string) {
        return await this.client.action('MINECRAFT_SERVER_COMMAND', this.name, command)
    }

    public getStatus() {
        return this.client.action('MINECRAFT_SERVER_STATUS', this.name)
    }

    public async getLogs() {
        const response = await fetch(`${this.client.httpAddress}/api/server/log/${this.name}`)
        return await response.text()
    }

    public getServerProperties() {
        return this.client.action('MINECRAFT_SERVER_GET_PROPERTIES', this.name)
    }

    public saveServerProperties(properties: ServerProperties) {
        return this.client.action('MINECRAFT_SERVER_SAVE_PROPERTIES', this.name, properties)
    }

    public getPlugins() {
        return this.client.action('MINECRAFT_SERVER_GET_PLUGINS', this.name)
    }

    public deletePlugin(fileName: string) {
        return this.client.action('MINECRAFT_SERVER_DELETE_PLUGIN', this.name, fileName)
    }
}
