import { Constants } from '@/constants'
import { Core } from '@/core'
import { isDev } from '@/index'
import { JsonDB } from 'node-json-db'
import path from 'path'

import { Permission } from './permission'
import { User } from './user'

export class UserManager {
    private readonly db = new JsonDB(path.join(Constants.DATA_PATH, 'database', 'user'), true, isDev)

    constructor(private readonly _core: Core) {
        if (!this._core.roleManager) throw new Error('RoleManager not initialized')
        if (!this.db.exists('/users')) {
            const defaultUser = new User('root', 'password', [new Permission('*')], ['root'])
            this.db.push('/users', [defaultUser])
        }
    }

    public create(username: string, password: string, permissions?: Permission[], roles?: string[]) {
        const user = new User(username, password, permissions ?? [], roles ?? [])
        this.db.push('/users[]', user)
    }

    public update(username: string, password?: string, permissions?: Permission[], roles?: string[]) {
        const user = this.get(username)
        if (!user) return

        this.db.delete(`/users[${this.getAll().indexOf(user)}]`)
        this.create(username, password ?? user.password, permissions ?? user.permissions, roles ?? user.roles)
    }

    public get(username: string) {
        const users = this.getAll()
        return users.find((user) => user.username === username)
    }

    public getAll() {
        return this.db.getObject<User[]>('/users').map((v) => new User(v.username, v.password, Permission.fromArray(v.permissions), v.roles))
    }

    public delete(username: string) {
        const user = this.get(username)
        if (user) this.db.delete(`/users[${this.getAll().indexOf(user)}]`)
    }
}
