import { ServerStatusDetail } from 'bacon-types'
import fs from 'fs-extra'
import { JsonDB } from 'node-json-db'
import path from 'path'
import { EventEmitter } from 'stream'
import StrictEventEmitter from 'strict-event-emitter-types'

import { isDev } from '..'
import { Constants } from '../Constants'
import { ApiServer } from '../http'
import { Level, Logger } from '../util/Logger'
import { PermissionManager } from './system/Auth/PermissionManager'
import { RoleManager } from './system/Auth/RoleManager'
import { UserManager } from './system/Auth/UserManager'
import { ServerManager } from './system/minecraft/ServerManager'

type Events = {
    'status-update': typeof ServerStatusDetail[number]
}

export class Core extends (EventEmitter as new () => StrictEventEmitter<EventEmitter, Events>) {
    public static init = () => (this.instance = new Core())
    public static instance: Core

    private status: typeof ServerStatusDetail[number] = 'starting'
    public readonly config = new JsonDB(path.join(Constants.DATA_PATH, 'config'), true, isDev)

    // futures

    public readonly permissionManager: PermissionManager
    public readonly roleManager: RoleManager
    public readonly userManager: UserManager
    public readonly serverManager: ServerManager

    public readonly server: ApiServer

    private constructor() {
        super()
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

        Logger.init(isDev ? Level.DEBUG : Level.INFO, false)

        this.server.listen(3000)
    }

    public updateStatus(status: typeof ServerStatusDetail[number]) {
        this.status = status
        this.emit('status-update', status)
    }
    public getStatus() {
        return this.status
    }
}
