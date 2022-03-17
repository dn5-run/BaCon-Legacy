import { SessionData } from '../io/session-data'
import { BaseStore } from './base-store'

export const SessionStore = new (class implements BaseStore<SessionData> {
    public readonly data: SessionData[] = []
    public list() {
        return this.data
    }
    public get(token: string) {
        return this.data.find((session) => session.token === token)
    }
    public add(data: SessionData) {
        if (this.get(data.token)) throw new Error(`Session with token ${data.token} already exists`)
        this.data.push(data)
    }
    public delete(id: string) {
        const data = this.get(id)
        if (!data) throw new Error(`Session with id ${id} not found`)
        this.data.splice(this.data.indexOf(data), 1)
    }
})()
