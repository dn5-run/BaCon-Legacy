import { Actions, ArgumentTypes } from "bacon-types";

export class ActionHandler {
    private _queue: {
        resolve: (...args: any) => any;
        reject: (...args: any) => any;
        action: keyof Actions;
        args: ArgumentTypes<Actions[keyof Actions]>;
    }[] = []
    private isHandling = false

    constructor(
        private readonly executor: (action: keyof Actions, ...args: ArgumentTypes<Actions[keyof Actions]>) => Promise<ReturnType<Actions[keyof Actions]>>
    ) {}

    private async handle() {
        if (this._queue.length === 0) return (this.isHandling = false)
        this.isHandling = true
        for (const queue of this._queue) {
            let prevLength = this._queue.length
            const { resolve, reject, action , args } = queue
            this._queue = this._queue.filter(q => q !== queue)
            let newLength = this._queue.length
            if (prevLength === newLength) throw new Error('Queue is broken')
            try {
                resolve(await this.executor(action, ...args))
            } catch (err) {
                reject(err)
            }
        }
        this.handle()
    }

    public queue<A extends keyof Actions>(action: A, ...args: ArgumentTypes<Actions[A]>){
        return new Promise<ReturnType<Actions[A]>>((resolve, reject) => {
            this._queue.push({
                resolve,
                reject,
                action,
                args,
            })
            if (!this.isHandling) this.handle()
        })
    }
}
