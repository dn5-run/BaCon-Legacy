import { ArgumentTypes } from '../util'
import { ActionResponse, Actions, SystemStatusData } from '../core'

export interface ServerToClientEvents {
    login: (token?: string) => void
    auth: (result: boolean) => void
    action: <A extends keyof Actions>(action: A, value: ActionResponse<A>) => void
    status: (status: SystemStatusData) => void
}

export interface ClientToServerEvents {
    login: (username: string, password: string) => void
    auth: () => void
    action: <A extends keyof Actions>(action: A, args: ArgumentTypes<Actions[A]>) => void
}

export interface InterServerEvents {
    ping: void
}

export interface SocketData {
    username: string
}
