import { Client, Server } from 'bacon-client'

import { showNotification } from '../../components/Notice'

export class Serverw extends Server {
    public static fromArray(servers: Server[], client: Client) {
        return servers.map((server) => new Serverw(server, client))
    }

    constructor(server: Server, client: Client) {
        super(server, client)
    }

    public async start() {
        try {
            await super.start()
            showNotification('Server started', 'positive')
        } catch (error) {
            showNotification(typeof error === 'string' ? error : 'An error has occurred.', 'negative')
        }
    }

    public async stop() {
        try {
            await super.stop()
            showNotification('Server stopped', 'positive')
        } catch (error) {
            showNotification(typeof error === 'string' ? error : 'An error has occurred.', 'negative')
        }
    }

    public async restart() {
        try {
            await super.stop()
            console.log('stopped')
            await super.start()
            console.log('started')
            showNotification('Server restarted', 'positive')
        } catch (error) {
            showNotification(typeof error === 'string' ? error : 'An error has occurred.', 'negative')
        }
    }
}
