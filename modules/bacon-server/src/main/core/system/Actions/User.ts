import { Core } from '../..'
import { Action } from '../../Action'
import { Permission } from '../Auth/Permission'
import { SYSTEM_PERMISSIONS } from '../SystemPermissions'

export const UserActions = [
    new Action('USER_CREATE', SYSTEM_PERMISSIONS.SYSTEM_USER_CREATE, async (sender, username, password, permissions, roles) => {
        const { userManager } = Core.instance
        userManager.create(
            username,
            password,
            permissions.map((p) => new Permission(p)),
            roles,
        )
        return 'User created'
    }),
    new Action('USER_DELETE', SYSTEM_PERMISSIONS.SYSTEM_USER_DELETE, async (sender, username) => {
        const { userManager } = Core.instance
        userManager.delete(username)
        return 'User deleted'
    }),
    new Action('USER_UPDATE', SYSTEM_PERMISSIONS.SYSTEM_USER_UPDATE, async (sender, username, password, permissions, roles) => {
        const { userManager } = Core.instance
        userManager.update(
            username,
            password,
            permissions?.map((p) => new Permission(p)),
            roles,
        )
        return 'User updated'
    }),
    new Action('USER_LIST', SYSTEM_PERMISSIONS.SYSTEM_USER_LIST, async () => {
        const { userManager } = Core.instance
        return userManager.getAll()
    }),
]
