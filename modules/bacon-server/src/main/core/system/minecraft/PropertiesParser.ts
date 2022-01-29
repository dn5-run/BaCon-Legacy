import { ServerProperties } from 'bacon-types'
import os from 'os'

export const isServerProperties = (obj: any): obj is ServerProperties => {
    const keys = Object.keys(obj)
    if (keys.length !== 23) return false

    const requiredKeys = [
        'spawn-protection',
        'max-tick-time',
        'query.port',
        'generator-settings',
        'sync-chunk-writes',
        'force-gamemode',
        'allow-nether',
        'enforce-whitelist',
        'gamemode',
        'broadcast-console-to-ops',
        'enable-query',
        'player-idle-timeout',
        'text-filtering-config',
        'difficulty',
        'broadcast-rcon-to-ops',
        'spawn-monsters',
        'op-permission-level',
        'pvp',
        'entity-broadcast-range-percentage',
        'snooper-enabled',
        'level-type',
        'enable-status',
        'resource-pack-prompt',
        'hardcore',
        'enable-command-block',
        'network-compression-threshold',
        'max-players',
        'max-world-size',
        'resource-pack-sha1',
        'function-permission-level',
        'rcon.port',
        'server-port',
        'server-ip',
        'spawn-npcs',
        'require-resource-pack',
        'allow-flight',
        'level-name',
        'view-distance',
        'resource-pack',
        'spawn-animals',
        'white-list',
        'rcon.password',
        'generate-structures',
        'online-mode',
        'level-seed',
        'prevent-proxy-connections',
        'use-native-transport',
        'enable-jmx-monitoring',
        'motd',
        'rate-limit',
        'enable-rcon',
    ]
    const missingKeys = requiredKeys.filter((key) => !keys.includes(key))
    if (missingKeys.length > 0) return false

    return true
}
export const stringifyServerProperties = (properties: ServerProperties) => {
    const keys = Object.keys(properties) as (keyof ServerProperties)[]
    const lines = keys.map((key) => `${key}=${properties[key]}`)
    return lines.join(os.EOL)
}
export const parseServerProperties = (properties: string): ServerProperties => {
    const lines = properties.split(/\r\n|\n|\r/)
    const obj: {
        [key: string]: string | number | boolean
    } = {}
    for (const line of lines) {
        if (line.startsWith('#')) continue
        const [key, value] = line.split(/=/)
        if (!key || !value) continue
        if (!isNaN(Number(value))) {
            obj[key] = Number(value)
            continue
        }
        if (value === 'true' || value === 'false') {
            obj[key] = value === 'true'
            continue
        }
        obj[key] = value
    }
    if (isServerProperties(obj)) return obj
    throw new Error('Invalid server properties')
}
