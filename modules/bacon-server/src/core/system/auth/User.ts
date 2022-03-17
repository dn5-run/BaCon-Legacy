import { Core } from '../..'
import { Permission } from './Permission'
import { Role } from './Role'

export class User {
    constructor(
        public readonly username: string,
        public readonly password: string,
        public readonly permissions: Permission[],
        public readonly roles: string[],
    ) {}

    public getPermissions() {
        const roleManager = Core.instance.roleManager
        const roles = this.roles.map((r) => roleManager.get(r)).filter((r) => r instanceof Role) as Role[]
        return roles.reduce<Permission[]>((perms, role) => perms.concat(role.getPermissions()), [])
    }
}
