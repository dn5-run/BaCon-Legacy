import { ActionResponse, Actions, ArgumentTypes } from 'bacon-types'

import { User } from '../auth/user'
import { Action } from './action'
import { SYSTEM_ACTIONS } from './system-actions'

export class ActionManager {
    private readonly ActionList: Action[] = []

    constructor() {
        for (const action of SYSTEM_ACTIONS) {
            this.ActionList.push(action as any) //TODO: 型を設定する。
        }
    }

    public async execute<A extends keyof Actions>(sender: User, name: A, ...args: ArgumentTypes<Actions[A]>): Promise<ActionResponse<A>> {
        const action = this.ActionList.find((a) => a.id === name)
        if (!action) throw new Error(`Action ${name} not found`)

        try {
            const result = await action.execute(sender, args)
            return {
                result: true,
                data: result,
            }
        } catch (error) {
            return {
                result: false,
                error: error instanceof Error ? error.message : error,
            }
        }
    }
}
