import { User } from '../../core/system/Auth/User'
import { SocketType } from '../types'

export class SessionData {
    public socket?: SocketType
    constructor(public readonly user: User, public readonly token: string) {}
}
