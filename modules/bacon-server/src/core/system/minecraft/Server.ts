import { MinecraftServerType, ServerProperties, ServerSoft, ServerStatus, ServerType } from 'bacon-types'
import { ChildProcess, spawn } from 'child_process'
import EventEmitter from 'events'
import fs from 'fs-extra'
import * as mcutil from 'minecraft-server-util'
import os from 'os'
import path from 'path'
import pidUsage from 'pidusage'
import StrictEventEmitter from 'strict-event-emitter-types'

import { Constants } from '../../../Constants'
import { Logger } from '../../../util/Logger'
import { fileDownloader } from '../independent/FileDownloader'
import { javaManager } from '../independent/java'
import { serverSoftManager } from '../independent/ServerSoftManager'
import { statusEmitter } from '../independent/StatusEmitter'
import { Plugin } from './Plugin'
import { parseServerProperties, stringifyServerProperties } from './PropertiesParser'

type Events = {
    'config-update': MinecraftServerType
    stdout: string
    stderr: string
    close: void
    spawn: void
}

export class Server extends (EventEmitter as new () => StrictEventEmitter<EventEmitter, Events>) implements MinecraftServerType {
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

    private process?: ChildProcess
    private readonly commandHistory: string[] = []

    constructor(config: MinecraftServerType) {
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
    }

    private async ping() {
        try {
            return await mcutil.status('localhost', this.port, {
                timeout: 1000 * 2,
            })
        } catch (error) {
            return undefined
        }
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

    public updateConfig(config: Partial<MinecraftServerType>) {
        if (config.name && config.name.match(/#/)) throw new Error(`Server name ${config.name} contains characters that cannot be used.`)
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

        this.emit('config-update', this.getConfig())
    }

    public getLog() {
        if (!fs.existsSync(path.join(this.dir, 'logs', 'latest.log'))) return ''
        return fs.readFileSync(path.join(this.dir, 'logs', 'latest.log'), 'utf8')
    }

    public getCommandHistory(index: number) {
        return this.commandHistory[index]
    }

    public async start() {
        const logger = Logger.get()
        const java = this.java && Object.keys(this.java).length > 0 ? this.java : javaManager.getJava()
        if (!fs.existsSync(java)) throw new Error(`Java not found at ${java}`)

        if (!fs.existsSync(this.dir)) {
            this.emit('stdout', `[BACON] Creating server directory at ${this.dir}`)
            fs.mkdirSync(this.dir)
            fs.writeFileSync(path.join(this.dir, 'eula.txt'), 'eula=true')
        }

        /** Create JVM arguments */
        if (!serverSoftManager.getSofts().find((s) => s.name === this.soft.name)) throw new Error(`Server soft not found at ${this.soft}`)
        const softPath = path.join(Constants.DATA_PATH, 'soft', this.soft.name)
        const customJVMArgs = this.customJVMArgs
            .split(' ')
            .filter((arg) => Object.keys(arg).length > 0 && !arg.match(/-Xmx|-Xms/))
            .map((v) => `${v.trim()}`)
        const JVMArgs = [`-Xmx${this.maxMemory}M`, `-Xms${this.minMemory}M`, `-jar`, ...customJVMArgs, softPath]

        /** Create server arguments */
        const customServerArgs = this.customServerArgs.split(' ').map((v) => v.trim())
        if (this.type === 'server') {
            customServerArgs.push(`-p${this.port}`)
            customServerArgs.push(`--nogui`)
        }
        /** Spawn server process */
        const fullArgs = [...JVMArgs, ...customServerArgs]

        await new Promise<void>((resolve, reject) => {
            this.process = spawn(java, fullArgs, { cwd: this.dir })
            logger.info(`Spawning server ${this.name} with arguments ${java} ${fullArgs.join(' ')}`)

            this.process.stderr?.on('data', (data) => {
                this.emit('stderr', data.toString())
                statusEmitter.broadcast({
                    key: `server.${this.name}.stderr`,
                    title: data.toString().replace(os.EOL, ''),
                })
                resolve()
            })
            this.process.stdout?.on('data', (data) => {
                this.emit('stdout', data.toString())
                statusEmitter.broadcast({
                    key: `server.${this.name}.stdout`,
                    title: data.toString().replace(os.EOL, ''),
                })
                resolve()
            })

            this.process.once('error', () => {
                logger.error(`Failed to spawn server ${this.name}`)
                this.process?.kill()
                this.process = undefined
                reject(new Error('Failed to spawn server'))
            })
            this.process.once('close', (c) => {
                logger.info(`Server ${this.name} closed with code ${c}`)
                this.process = undefined
                this.emit('close')
                statusEmitter.broadcast({
                    key: `server.${this.name}.close`,
                    title: 'Server closed',
                })
            })
        })
    }

    public stop() {
        return new Promise<void>((resolve, reject) => {
            if (!this.process) reject(new Error('Server not running'))

            if (this.type === 'velocity' || this.type === 'bungee') this.process?.stdin?.write('end' + os.EOL)
            else this.process?.stdin?.write('stop' + os.EOL)

            this.once('close', resolve)
        })
    }

    public command(command: string) {
        if (!this.process) throw new Error('Server not running')
        if (((this.type === 'velocity' || this.type === 'bungee') && command === 'end') || (this.type === 'server' && command === 'stop')) this.stop()

        this.process.stdin?.write(command + os.EOL)
        this.commandHistory.push(command)
    }

    public async getStatus(): Promise<ServerStatus> {
        if (!this.process || !this.process.pid) return { status: false }
        const data = await pidUsage(this.process.pid)
        const ping = await this.ping()
        return {
            status: true,
            cpuUsage: data.cpu / os.cpus().length,
            memoryUsage: data.memory,
            totalMemory: os.totalmem(),
            players: ping ? ping.players.online : 'N/A',
        }
    }

    public getServerProperties() {
        if (!fs.existsSync(path.join(this.dir, 'server.properties'))) throw new Error('Server properties not found')
        const file = fs.readFileSync(path.join(this.dir, 'server.properties'))
        return parseServerProperties(file.toString())
    }

    public saveServerProperties(properties: ServerProperties) {
        return stringifyServerProperties(properties)
    }

    public getPlugins() {
        if (!fs.existsSync(path.join(this.dir, 'plugins'))) throw new Error('Plugins not found')
        return fs
            .readdirSync(path.join(this.dir, 'plugins'))
            .filter((file) => file.endsWith('.jar'))
            .map((file) => new Plugin(path.join(this.dir, 'plugins', file), this.type))
    }

    public downloadPlugin(url: string, name: string) {
        fileDownloader.download(url, name, path.join(this.dir, 'plugins'))
    }

    public addPlugin(filepath: string, originalname?: string){
        if (!fs.existsSync(filepath)) throw new Error('Plugin not found')
        if (!fs.existsSync(path.join(this.dir, 'plugins'))) fs.mkdirSync(path.join(this.dir, 'plugins'))
        fs.copyFileSync(filepath, path.join(this.dir, 'plugins', originalname || path.basename(filepath)))
    }

    public deletePlugin(fileName: string) {
        if (!fs.existsSync(path.join(this.dir, 'plugins', fileName))) throw new Error('Plugin not found')
        fs.unlinkSync(path.join(this.dir, 'plugins', fileName))
    }
}
