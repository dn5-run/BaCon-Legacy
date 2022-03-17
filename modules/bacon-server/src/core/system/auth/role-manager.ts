import { JsonDB } from 'node-json-db'
import path from 'path'

import { Core } from '../..'
import { isDev } from '../../..'
import { Constants } from '../../../constants'
import { Permission } from './permission'
import { Role } from './role'

export class RoleManager {
    private readonly db = new JsonDB(path.join(Constants.DATA_PATH, 'database', 'role'), true, isDev)

    constructor(private readonly _core: Core) {
        if (!this.db.exists('/roles')) {
            const defaultRole = new Role('root', 0, [new Permission('*')])
            this.db.push('/roles', [defaultRole])
        }
    }

    public create(name: string, status: number, permissions: string[] | Permission[]) {
        const role = new Role(name, status, Permission.fromArray(permissions))
        this.db.push('/roles[]', role)
    }

    public get(name: string) {
        const roles = this.getAll()
        return roles.find((role) => role.name === name)
    }

    public getAll() {
        return this.db.getObject<Role[]>('/roles').map((v) => new Role(v.name, v.status, v.permissions))
    }

    public delete(name: string) {
        const roles = this.getAll()
        const role = this.get(name)
        if (role) this.db.delete(`/roles[${roles.indexOf(role)}]`)
    }
}
