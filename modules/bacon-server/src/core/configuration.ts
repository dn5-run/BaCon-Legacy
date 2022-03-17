import { CorsOptions } from 'cors'
import crypto from 'crypto'
import fs from 'fs-extra'
import path from 'path'

import { Constants } from '../constants'

class Configuration {
    public port = 41180
    public ssl = false
    public brancaSecret = crypto.randomBytes(32).toString('hex')
    public cors: CorsOptions = {
        origin: true,
        credentials: true,
    }
    public cookie = {
        secret: crypto.randomBytes(32).toString('hex'),
    }
    constructor() {
        if (!fs.existsSync(Constants.DATA_PATH)) fs.mkdirSync(Constants.DATA_PATH)
        if (!fs.existsSync(path.join(Constants.DATA_PATH, 'config.json'))) this.init()
        else {
            const config = fs.readJSONSync(path.join(Constants.DATA_PATH, 'config.json')) as Configuration
            this.checkConfigValues(config)
            this.port = config.port
            this.ssl = config.ssl
            this.brancaSecret = config.brancaSecret
            this.cors = config.cors
            this.cookie = config.cookie
            this.init()
        }
    }

    private init() {
        fs.writeJSONSync(path.join(Constants.DATA_PATH, 'config.json'), this, { spaces: 4 })
    }

    private checkConfigValues(config: Configuration) {
        if (!config.port) config.port = this.port
        if (!config.ssl) config.ssl = this.ssl
        if (!config.brancaSecret) config.brancaSecret = this.brancaSecret
        if (!config.cors) config.cors = this.cors
        if (!config.cookie) config.cookie = this.cookie
    }
}
export const config = new Configuration()
