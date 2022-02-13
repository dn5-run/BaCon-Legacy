import { Client } from 'bacon-client'

import { ClientW } from './ClientWrapper'

interface StoreType {
    client: ClientW
}

export const store: StoreType = {
    client: new ClientW(window.location.hostname, parseInt(window.location.port), window.location.protocol === 'https:'),
}
