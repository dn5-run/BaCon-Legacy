import { Actions, ArgumentTypes } from 'bacon-types'

import { Permission } from './system/auth/Permission'
import { User } from './system/auth/User'

export class Action<
    ActionName extends keyof Actions = keyof Actions,
    Args extends ArgumentTypes<Actions[ActionName]> = ArgumentTypes<Actions[ActionName]>,
    ReturnValueType = any, //TODO: 型をどうにかしっかり設定したい。
    HandlerType extends (sender: User, ...args: Args) => ReturnValueType = (sender: User, ...args: Args) => ReturnValueType,
> {
    constructor(
        public readonly id: ActionName,
        public readonly permission: Permission | ((...args: Args) => Permission) | undefined,
        private readonly handler: HandlerType,
    ) {}

    public execute(sender: User, args: Args) {
        const perm = typeof this.permission === 'function' ? this.permission(...args) : this.permission
        if (!perm || perm.isAllowed(sender)) {
            return this.handler(sender, ...args)
        }
        throw new Error('Permission denied')
    }
}
