import express from 'express'
import path from 'path'
import webpack from 'webpack'
import webpackDev from 'webpack-dev-middleware'
import webpackHot from 'webpack-hot-middleware'

export const createWebpackDevServer = async (cwd = path.resolve('../', 'bacon-browser') ) => {
    const app = express.Router()
    const config = (await import(path.join(cwd, 'webpack.config.ts'))).default as webpack.Configuration

    config.mode = 'development'
    config.entry = ['webpack-hot-middleware/client?reload=true', './src']
    config.plugins?.push(new webpack.HotModuleReplacementPlugin())

    const compiler = webpack(config)
    const dev = webpackDev(compiler, {
        publicPath: config.output?.publicPath,
    })
    const hot = webpackHot(compiler)

    app.use(dev)
    app.use(hot)

    return app
}
