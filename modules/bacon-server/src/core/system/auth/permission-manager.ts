import { SYSTEM_PERMISSIONS } from '../system-permissions'
import { Permission } from './permission'

export class PermissionManager {
    private readonly permissions: Permission[] = []

    constructor() {
        this.permissions.concat(Object.values(SYSTEM_PERMISSIONS))
    }

    public getPermissions() {
        return this.permissions
    }
}
