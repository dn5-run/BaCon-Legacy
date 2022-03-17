import { User } from '../../core/system/auth/user'
import { SocketType } from '../types'

export class SessionData {
    public socket?: SocketType
    constructor(public readonly user: User, public readonly token: string) {}
}
