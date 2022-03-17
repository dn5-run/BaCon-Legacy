import { MinecraftServerType, PluginType, ServerProperties, ServerSoft, ServerStatus } from './minecraft'

export interface Actions {
    USER_CREATE: (username: string, password: string, permissions: string[], roles?: string[]) => string
    USER_DELETE: (username: string) => string
    USER_UPDATE: (username: string, password?: string, permissions?: string[], roles?: string[]) => string
    USER_GET: (username: string) => string
    USER_LIST: () => string

    ROLE_CREATE: (name: string, parent?: string, permissions?: string[]) => string
    ROLE_DELETE: (name: string) => string
    ROLE_UPDATE: (name: string, parent?: string, permissions?: string[]) => string
    ROLE_GET: (name: string) => string
    ROLE_LIST: () => string

    MINECRAFT_SERVER_CREATE: (config: MinecraftServerType) => string
    MINECRAFT_SERVER_DELETE: (name: string) => string
    MINECRAFT_SERVER_UPDATE: (name: string, config: Partial<MinecraftServerType>) => string
    MINECRAFT_SERVER_GET: (name: string) => MinecraftServerType
    MINECRAFT_SERVER_LIST: () => MinecraftServerType[]
    MINECRAFT_SERVER_START: (name: string) => string
    MINECRAFT_SERVER_STOP: (name: string) => string
    MINECRAFT_SERVER_STATUS: (name: string) => ServerStatus
    MINECRAFT_SERVER_COMMAND: (name: string, command: string) => string
    MINECRAFT_SERVER_GET_PROPERTIES: (name: string) => ServerProperties
    MINECRAFT_SERVER_SAVE_PROPERTIES: (name: string, properties: ServerProperties) => string
    MINECRAFT_SERVER_DOWNLOAD_PLUGIN: (servername: string, url: string, name: string) => string
    MINECRAFT_SERVER_GET_PLUGINS: (name: string) => PluginType[]
    MINECRAFT_SERVER_DELETE_PLUGIN: (name: string, fileName: string) => string

    MINECRAFT_SOFT_DOWNLOAD: (url: string, name: string) => string
    MINECRAFT_SOFT_DELETE: (name: string) => string
    MINECRAFT_SOFT_GET: () => ServerSoft[]
}
export type ActionResponse<A extends keyof Actions = keyof Actions> =
    | {
          result: true
          data: ReturnType<Actions[A]>
      }
    | {
          result: false
          error: unknown
      }
