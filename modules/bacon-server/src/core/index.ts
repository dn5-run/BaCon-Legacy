import { Constants } from '@/constants'
import { ApiServer } from '@/http'
import { Level, Logger } from '@/utils/logger'
import { ServerStatusDetail } from 'bacon-types'
import fs from 'fs-extra'
import { EventEmitter } from 'stream'
import StrictEventEmitter from 'strict-event-emitter-types'

import { args, isDev } from '..'
import { config } from './configuration'
import { PermissionManager } from './futures/auth/permission-manager'
import { RoleManager } from './futures/auth/role-manager'
import { UserManager } from './futures/auth/user-manager'
import { ServerManager } from './futures/minecraft/server-manager'
import { statusEmitter } from './futures/status-emitter'

type Events = {
    'status-update': typeof ServerStatusDetail[number]
}

export class Core extends (EventEmitter as new () => StrictEventEmitter<EventEmitter, Events>) {
    public static init = () => (this.instance = new Core())
    public static instance: Core

    private _status: typeof ServerStatusDetail[number] = 'starting'
    public get status(): typeof ServerStatusDetail[number] {
        return this._status
    }

    // futures

    public readonly permissionManager: PermissionManager
    public readonly roleManager: RoleManager
    public readonly userManager: UserManager
    public readonly serverManager: ServerManager

    public readonly server: ApiServer

    private constructor() {
        super()
        Logger.init(isDev ? Level.DEBUG : Level.INFO, false)

        this.server = new ApiServer(this)

        this.permissionManager = new PermissionManager()
        this.roleManager = new RoleManager(this)
        this.userManager = new UserManager(this)
        this.serverManager = new ServerManager(this)

        this.bootstrap()
    }

    public async bootstrap() {
        if (!fs.existsSync(Constants.DATA_PATH)) fs.mkdirsSync(Constants.DATA_PATH)
        if (!fs.existsSync(Constants.TEMP_DIR)) fs.mkdirsSync(Constants.TEMP_DIR)

        this.server.listen(args.port || config.port || 41180)
    }

    public updateStatus(status: typeof ServerStatusDetail[number]) {
        Logger.get().debug(`Status changed to ${status}`)
        this._status = status
        this.emit('status-update', status)
    }

    public async exit() {
        statusEmitter.broadcast({
            title: 'shutdown',
            key: 'shutdown',
        })
        const tasks: Promise<void>[] = []
        for (const s of this.serverManager.getServers()) {
            const status = await s.getStatus()
            if (status.status) tasks.push(s.stop())
        }
        await Promise.all(tasks)
    }
}
