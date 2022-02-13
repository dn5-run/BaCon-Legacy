import { Core } from '../..'
import { Action } from '../../Action'
import { MinecraftActions } from './Minecraft'
import { UserActions } from './User'

const SystemRoot = [
    new Action(
        'GET_STATUS',
        undefined,
        async () => {
            console.log('GET_STATUS')
            return Core.instance.status
        },
        false,
    ),
]

export const SYSTEM_ACTIONS = [...SystemRoot, ...UserActions, ...MinecraftActions]
