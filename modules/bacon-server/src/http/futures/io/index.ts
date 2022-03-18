import { Core } from '@/core'
import { ActionManager } from '@/core/futures/action/action-manager'
import { statusEmitter } from '@/core/futures/status-emitter'
import { SessionStore } from '@/http/futures/store/session-store'
import { SessionSocket } from '@/http/types'
import { Logger } from '@/utils/logger'
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from 'bacon-types'
import { Server } from 'socket.io'

import { Authenticator } from '../auth/authenticator'
import { SessionData } from './session-data'

export class IO extends Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> {
    public readonly authenticator: Authenticator

    public readonly actionManager: ActionManager

    constructor(private readonly _core: Core) {
        super({
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        })
        this.authenticator = new Authenticator(this._core)
        this.actionManager = new ActionManager()

        this.init()
    }

    private init() {
        statusEmitter.on('broadcast', (data) => this.emit('status', data))

        this.on('connection', (s) => {
            const socket = s as SessionSocket
            const logger = Logger.get()

            logger.info(`Client connected: ${socket.id}  ip: ${socket.handshake.address} port: ${socket.handshake.auth}`)

            const noAuthActionHandler: ClientToServerEvents['action'] = (action, args) => {
                socket.emit('action', action, {
                    result: false,
                    error: 'Not authenticated',
                })
            }
            socket.on('action', noAuthActionHandler)
            socket.on('disconnect', () => {
                logger.info(`Client disconnected: ${socket.id}`)
            })
            socket.on('auth', () => {
                const token = socket.request.session.token

                logger.info(`Authenticating user with token: ${token}`)

                const sessionData = SessionStore.get(token)
                if (sessionData) {
                    sessionData.socket = socket

                    this.initForAuthenticatedUser(sessionData)
                    socket.off('action', noAuthActionHandler)
                    socket.emit('auth', true)
                    logger.info(`User authenticated with token: ${token}`)
                } else {
                    socket.emit('auth', false)
                    logger.info(`User failed to authenticate with token: ${token}`)
                }
            })
        })
    }

    private initForAuthenticatedUser(session: SessionData) {
        const logger = Logger.get()

        const socket = session.socket
        if (!socket) throw new Error('Socket not found')
        socket.on('action', async (action, args) => {
            logger.debug(`Received action: ${action}`)
            const res = await this.actionManager.execute(session.user, action, ...args)
            socket.emit('action', action, res)
        })
    }
}
