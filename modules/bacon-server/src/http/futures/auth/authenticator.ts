import { Core } from '@/core'

export class Authenticator {
    constructor(private readonly _core: Core) {}

    public async authenticate(username: string, password: string) {
        const user = this._core.userManager.get(username)
        if (!user) return undefined
        return user.password === password ? user : undefined
    }
}
