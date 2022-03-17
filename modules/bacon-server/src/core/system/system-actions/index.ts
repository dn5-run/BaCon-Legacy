import { MinecraftActions } from './Minecraft'
import { UserActions } from './User'

export const SYSTEM_ACTIONS = [...UserActions, ...MinecraftActions]
