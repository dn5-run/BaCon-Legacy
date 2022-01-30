import { SYSTEM_PERMISSIONS } from '../SystemPermissions'
import { Permission } from './Permission'

export class PermissionManager {
    private readonly permissions: Permission[] = []

    constructor() {
        this.permissions.concat(Object.values(SYSTEM_PERMISSIONS))
    }

    public getPermissions() {
        return this.permissions
    }
}
