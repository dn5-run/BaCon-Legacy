import { Client } from 'bacon-client'

interface StoreType {
    client: Client
}

export const store: StoreType = {
    client: new Client(window.location.hostname, parseInt(window.location.port), window.location.protocol === 'https:'),
}
