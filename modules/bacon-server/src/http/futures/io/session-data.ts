import { User } from '@/core/futures/auth/user'
import { SocketType } from '@/http/types'

export class SessionData {
    public socket?: SocketType
    constructor(public readonly user: User, public readonly token: string) {}
}
