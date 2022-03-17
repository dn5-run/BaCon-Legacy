export type ArgumentTypes<F extends (...args: any) => any> = F extends (...args: infer A) => any ? A : never
