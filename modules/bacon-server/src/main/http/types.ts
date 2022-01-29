import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from 'bacon-types'
import { SessionData } from 'express-session'
import 'expresss-session'
import { IncomingMessage } from 'http'
import { Socket } from 'socket.io'

declare module 'express-session' {
    interface SessionData {
        token: string
    }
}
interface SessionIncomingMessage extends IncomingMessage {
    session: SessionData
}
export type SocketType = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
export interface SessionSocket extends SocketType {
    request: SessionIncomingMessage
}
