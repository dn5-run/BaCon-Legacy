export interface APIUserType {
    username: string
    password: string
    permissions?: string[]
    roles?: string[]
}
export const isUser = (user: any): user is APIUserType => {
    return user && user.username && user.password && user.roles
}

export interface APIRoleType {
    name: string
    status: number
    parent?: string
    permissions?: string[]
}
export const isRole = (role: any): role is APIRoleType => {
    return role && role.name && role.permissions
}
