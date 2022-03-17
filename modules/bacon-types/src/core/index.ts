export * from './user'
export * from './action'
export * from './minecraft'

export const ServerStatusDetail = ['offline', 'starting', 'initialize-java', 'startup-server', 'online'] as const

export type progressStatusData = {
    current: number
    total: number
}
export const isProgressStatusData = (data: any): data is progressStatusData => {
    if (typeof data !== 'object' || data === null) return false
    if (typeof data.current !== 'number' || typeof data.total !== 'number') return false
    return true
}

export type SystemStatusData = {
    key: string
    title: string
    data?: progressStatusData | string
}
