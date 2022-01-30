import { Role } from './Role'
import { User } from './User'

export class Permission {
    public static fromArray(permissions: string[] | Permission[]): Permission[] {
        return permissions.map((perm) => new Permission(typeof perm === 'string' ? perm : perm.perm))
    }

    private readonly arrayPerm: string[]

    constructor(private readonly perm: string) {
        this.arrayPerm = perm.split('.')
    }

    public toString() {
        return this.perm
    }

    public isAllowed(permission: string | Permission | User | Role): boolean {
        const perm =
            typeof permission === 'string'
                ? permission
                : permission instanceof User
                ? permission.getPermissions()
                : permission instanceof Role
                ? permission.getPermissions()
                : permission.perm

        if (Array.isArray(perm)) {
            return perm.some((p) => this.isAllowed(p))
        }

        if (perm === '*') return true
        if (perm === this.perm) return true
        const parents = []
        for (const node of this.arrayPerm) {
            parents.push(node)
            if (perm === `${parents.join('.')}.*`) return true
        }
        return false
    }
}
