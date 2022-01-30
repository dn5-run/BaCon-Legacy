import Branca from 'branca'
import express, { RequestHandler, Router } from 'express'
import session from 'express-session'
import fs from 'fs-extra'
import http from 'http'
import fetch from 'node-fetch'
import path from 'path'

import { isDev } from '..'
import { Constants } from '../Constants'
import { Core } from '../core'
import { Dev } from '../dev'
import { SessionStore } from '../store/SessionStore'
import { Logger } from '../util/Logger'
import { Authenticator } from './Auth/Authenticator'
import { IO } from './io'
import { SessionData } from './io/SessionData'

const branca = Branca('49824bebd4b395e520ad780d644ff27caac39caccab02348b25a6af4f606e326')

export class ApiServer {
    private readonly app = express()
    private readonly server = http.createServer(this.app)
    private readonly io = new IO(this._core)

    public readonly authenticator = new Authenticator(this._core)

    constructor(private readonly _core: Core) {
        this.io.attach(this.server)

        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))

        const sessionMid = session({
            secret: 'secret',
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false,
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
            },
        })

        this.app.use(sessionMid)
        this.io.use((socket, next) => {
            sessionMid(socket.request as express.Request, {} as any, next as express.NextFunction)
        })

        this.app.use('/api/server', this.minecraft())
        this.app.use('/api/auth', this.auth())

        if (isDev) Dev.webpackDevServer(this.app)
        if (!isDev) {
            this.app.get('/main.js', (req, res) => res.sendFile(path.join(Constants.WEB_DIR, 'main.js')))
            this.app.get('/', (req, res) => res.sendFile(path.join(Constants.WEB_DIR, 'index.html')))
        }
    }

    public listen(port: number) {
        this.server.listen(port, () => {
            Logger.get().info(`Server started on port ${port}`)
        })
    }

    private isAuthorized: RequestHandler = (req, res, next) => {
        const token = req.session.token
        if (!token) return res.status(401).send('Unauthorized')

        const session = SessionStore.get(token)
        if (!session) return res.status(401).send('Unauthorized')

        next()
    }

    private auth() {
        const logger = Logger.get()
        const router = Router()
        router.post('/login', async (req, res) => {
            const username = req.body.username
            const password = req.body.password

            if (!username || !password) return res.status(400).send('Bad request')

            logger.info(`Authenticating user with username: ${username}`)

            const result = await this.authenticator.authenticate(username, password)

            if (result) {
                const token = branca.encode(username)
                req.session.token = token

                const sessionData = new SessionData(result, token)
                SessionStore.add(sessionData)
                logger.info(`User authenticated with username: ${username}`)
                return res.status(200).send(result)
            } else {
                logger.info(`User failed to authenticate with username: ${username}`)
                return res.status(401).send('Unauthorized')
            }
        })
        router.get('/logout', (req, res) => {
            const token = req.session.token
            if (token) {
                SessionStore.delete(token)
                req.session.destroy((err) => {
                    if (err) logger.error(err)
                })
                res.status(200).send('OK')
            } else {
                res.status(401).send('Unauthorized')
            }
        })
        return router
    }

    private minecraft() {
        const router = Router()
        router.post('/query', this.isAuthorized, async (req, res) => {
            const url = req.body.url
            if (!url) return res.status(400).send('Bad request')
            try {
                const response = await fetch(url)
                const redirectedUrl = response.url
                if (!response.ok) return res.status(response.status).send(response.statusText)
                const size = response.headers.get('content-length') || '0'
                const name = response.headers.get('content-disposition') || redirectedUrl.split('/').pop() || ''
                const mime = response.headers.get('content-type') || ''

                res.json({
                    size,
                    name,
                    mime,
                })
            } catch (error) {
                res.status(500).send('Internal server error')
            }
        })
        router.get('/log/:name', this.isAuthorized, async (req, res) => {
            const { serverManager } = Core.instance
            const server = serverManager.getServer(req.params.name)
            if (!server) return res.status(404).send('Server not found')

            const logPath = path.join(server?.dir, 'logs', 'latest.log')
            if (!fs.existsSync(logPath)) return res.status(404).send('Log not found')

            res.send(fs.readFileSync(logPath, 'utf8'))
        })
        return router
    }
}
