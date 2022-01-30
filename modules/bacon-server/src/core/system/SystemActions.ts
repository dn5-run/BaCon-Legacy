import { Core } from '..'
import { Action } from '../Action'
import { MinecraftActions } from './Actions/Minecraft'
import { UserActions } from './Actions/User'

const SystemRoot = [
    new Action('GET_STATUS', undefined, async () => {
        return Core.instance.getStatus()
    }),
]

export const SYSTEM_ACTIONS = [...SystemRoot, ...UserActions, ...MinecraftActions]
