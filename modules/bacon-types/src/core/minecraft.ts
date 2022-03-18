export type ServerType = 'server' | 'bungee' | 'velocity' | 'other'

export interface MinecraftServerType {
    name: string
    type: ServerType
    dir: string
    soft: ServerSoft
    port: number
    java?: string
    maxMemory: number
    minMemory: number
    customJVMArgs?: string
    customServerArgs?: string
    autoStart: boolean
}

export interface PluginType {
    fileName: string
    fileSize: number
    meta?: PluginYaml
}

export type ServerStatus =
    | {
          status: true
          cpuUsage: number
          memoryUsage: number
          totalMemory: number
          players: number | string
      }
    | {
          status: false
      }

export interface ServerProperties {
    'spawn-protection': number
    'max-tick-time': number
    'query.port': number
    'generator-settings': string
    'sync-chunk-writes': boolean
    'force-gamemode': boolean
    'allow-nether': boolean
    'enforce-whitelist': boolean
    gamemode: number
    'broadcast-console-to-ops': boolean
    'enable-query': boolean
    'player-idle-timeout': number
    'text-filtering-config': string
    difficulty: number
    'broadcast-rcon-to-ops': boolean
    'spawn-monsters': boolean
    'op-permission-level': number
    pvp: boolean
    'entity-broadcast-range-percentage': number
    'snooper-enabled': boolean
    'level-type': string
    'enable-status': boolean
    'resource-pack-prompt': string
    hardcore: boolean
    'enable-command-block': boolean
    'network-compression-threshold': number
    'max-players': number
    'max-world-size': number
    'resource-pack-sha1': string
    'function-permission-level': number
    'rcon.port': number
    'server-port': number
    'server-ip': string
    'spawn-npcs': boolean
    'require-resource-pack': boolean
    'allow-flight': boolean
    'level-name': string
    'view-distance': number
    'resource-pack': string
    'spawn-animals': boolean
    'white-list': boolean
    'rcon.password': string
    'generate-structures': boolean
    'online-mode': boolean
    'level-seed': string
    'prevent-proxy-connections': boolean
    'use-native-transport': boolean
    'enable-jmx-monitoring': boolean
    motd: string
    'rate-limit': number
    'enable-rcon': boolean
}

// plugin
export interface PluginYaml {
    name: string
    version: string
    description?: string
    load?: string
    author?: string
    authors?: string[]
    website?: string
    main: string
    database?: boolean
    prefix?: string
    depend?: string[]
    softdepend?: string[]
    loadbefore?: string[]
    commands?: {
        [key: string]: Command
    }
    permissions?: {
        [key: string]: Permission
    }
    'default-permission'?: string
}
export type Command = {
    description: string
    aliases: string[]
    permission: string
    'permission-message': string
    usage: string
}
export type Permission = {
    description: string
    default: boolean
    children: {
        [key: string]: boolean
    }
}

export interface VelocityPluginJson {
    id: string
    name: string
    version: string
    description: string
    url: string
    authors: string[]
    dependencies: string[]
    main: string
}

// Server software
export type ServerSoft = {
    name: string
    size: number
}

export type FileStat = {
    name: string
    path: string
    size: number
    isBinary: boolean
    isDirectory: boolean
    isFile: boolean
    children?: FileStat[]
}
