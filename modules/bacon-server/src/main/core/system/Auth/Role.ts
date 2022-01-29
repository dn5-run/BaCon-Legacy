import { Core } from '../..'
import { Permission } from './Permission'

export class Role {
    constructor(
        public readonly name: string,
        public readonly status: number,
        public readonly permissions: Permission[],
        public readonly parent?: string,
    ) {}

    public getPermissions(): Permission[] {
        const roleManager = Core.instance.roleManager
        const parent = this.parent && roleManager.get(this.parent)
        return parent ? parent.getPermissions().concat(this.permissions) : this.permissions
    }
}
