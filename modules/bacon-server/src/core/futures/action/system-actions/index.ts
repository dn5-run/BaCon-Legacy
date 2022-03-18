import { Action } from '../action'
import { MinecraftActions } from './minecraft'
import { UserActions } from './user'

export const SYSTEM_ACTIONS = [...UserActions, ...MinecraftActions]
