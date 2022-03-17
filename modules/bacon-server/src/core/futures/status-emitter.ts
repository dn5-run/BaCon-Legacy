import { SystemStatusData } from 'bacon-types'
import EventEmitter from 'events'
import StrictEventEmitter from 'strict-event-emitter-types'

type Events = {
    broadcast: SystemStatusData
}

class StatusEmitter extends (EventEmitter as new () => StrictEventEmitter<EventEmitter, Events>) {
    constructor() {
        super()
    }

    public broadcast(data: SystemStatusData) {
        this.emit('broadcast', data)
    }
}

export const statusEmitter = new StatusEmitter()
