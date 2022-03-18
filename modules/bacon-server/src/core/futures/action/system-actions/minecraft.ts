import { Core } from '@/core'
import { Action } from '@/core/futures/action/action'
import { FileStat } from 'bacon-types'

import { serverSoftManager } from '../../minecraft/server-soft-manager'
import { SYSTEM_PERMISSIONS } from '../../system-permissions'

export const MinecraftActions = [
    /**
     *
     * Common Minecraft Server Actions
     *
     */
    new Action('MINECRAFT_SERVER_CREATE', SYSTEM_PERMISSIONS.SYSTEM_MINECRAFT_SERVER_CREATE, async (sender, config) => {
        const { serverManager } = Core.instance
        serverManager.createServer(config)
        return 'Server created'
    }),
    new Action('MINECRAFT_SERVER_DELETE', SYSTEM_PERMISSIONS.SYSTEM_MINECRAFT_SERVER_DELETE, async (sender, name) => {
        const { serverManager } = Core.instance
        serverManager.deleteServer(name)
        return 'Server deleted'
    }),
    new Action('MINECRAFT_SERVER_UPDATE', SYSTEM_PERMISSIONS.SYSTEM_MINECRAFT_SERVER_UPDATE, (sender, name, config) => {
        const { serverManager } = Core.instance
        const server = serverManager.getServer(name)
        if (!server) throw new Error('Server not found')
        server.updateConfig(config)
        serverManager.updateDataBase()
        return 'Server updated'
    }),
    new Action('MINECRAFT_SERVER_GET', SYSTEM_PERMISSIONS.SYSTEM_MINECRAFT_SERVER_GET, (sender, name) => {
        const { serverManager } = Core.instance
        return serverManager.getServer(name)?.getConfig()
    }),
    new Action('MINECRAFT_SERVER_LIST', SYSTEM_PERMISSIONS.SYSTEM_MINECRAFT_SERVER_LIST, () => {
        const { serverManager } = Core.instance
        return serverManager.getServers()
    }),
    new Action('MINECRAFT_SERVER_START', SYSTEM_PERMISSIONS.SYSTEM_MINECRAFT_SERVER_START, async (sender, name) => {
        const { serverManager } = Core.instance
        const server = serverManager.getServer(name)
        await server?.start()
        return 'Server started'
    }),
    new Action('MINECRAFT_SERVER_STOP', SYSTEM_PERMISSIONS.SYSTEM_MINECRAFT_SERVER_STOP, async (sender, name) => {
        const { serverManager } = Core.instance
        const server = serverManager.getServer(name)
        await server?.stop()
        return 'Server stopped'
    }),
    new Action('MINECRAFT_SERVER_COMMAND', SYSTEM_PERMISSIONS.SYSTEM_MINECRAFT_SERVER_COMMAND, async (sender, name, command) => {
        const { serverManager } = Core.instance
        const server = serverManager.getServer(name)
        server?.command(command)
        return 'Command executed'
    }),
    new Action('MINECRAFT_SERVER_STATUS', SYSTEM_PERMISSIONS.SYSTEM_MINECRAFT_SERVER_STATUS, async (sender, name) => {
        const { serverManager } = Core.instance
        const server = serverManager.getServer(name)
        return server?.getStatus()
    }),

    /**
     *
     * Server Soft Actions
     *
     */

    new Action('MINECRAFT_SOFT_DOWNLOAD', SYSTEM_PERMISSIONS.SYSTEM_MINECRAFT_SOFT_DOWNLOAD, (sender, url, name) => {
        if (serverSoftManager.getSofts().filter((soft) => soft.name === name).length > 0) throw new Error('Soft already exists')
        serverSoftManager.download(url, name)
        return 'Download started'
    }),
    new Action('MINECRAFT_SOFT_DELETE', SYSTEM_PERMISSIONS.SYSTEM_MINECRAFT_SOFT_DELETE, (sender, name) => {
        serverSoftManager.deleteSoft(name)
        return 'Soft deleted'
    }),
    new Action('MINECRAFT_SOFT_GET', SYSTEM_PERMISSIONS.SYSTEM_MINECRAFT_SOFT_GET, () => {
        return serverSoftManager.getSofts()
    }),
    new Action('MINECRAFT_SERVER_GET_PROPERTIES', SYSTEM_PERMISSIONS.SYSTEM_MINECRAFT_SERVER_GET_PROPERTIES, (sender, name) => {
        const { serverManager } = Core.instance
        const server = serverManager.getServer(name)
        return server?.getServerProperties()
    }),
    new Action('MINECRAFT_SERVER_SAVE_PROPERTIES', SYSTEM_PERMISSIONS.SYSTEM_MINECRAFT_SERVER_SAVE_PROPERTIES, (sender, name, properties) => {
        const { serverManager } = Core.instance
        const server = serverManager.getServer(name)
        server?.saveServerProperties(properties)
        return 'Server properties updated'
    }),
    new Action('MINECRAFT_SERVER_DOWNLOAD_PLUGIN', SYSTEM_PERMISSIONS.SYSTEM_MINECRAFT_SERVER_DOWNLOAD_PLUGIN, (sender, servername, url, name) => {
        const { serverManager } = Core.instance
        const server = serverManager.getServer(servername)
        server?.downloadPlugin(url, name)
        return 'Start download plugin'
    }),
    new Action('MINECRAFT_SERVER_GET_PLUGINS', SYSTEM_PERMISSIONS.SYSTEM_MINECRAFT_SERVER_GET_PLUGINS, (sender, name) => {
        const { serverManager } = Core.instance
        const server = serverManager.getServer(name)
        return server?.getPlugins()
    }),
    new Action('MINECRAFT_SERVER_DELETE_PLUGIN', SYSTEM_PERMISSIONS.SYSTEM_MINECRAFT_SERVER_REMOVE_PLUGIN, (sender, name, fileName) => {
        const { serverManager } = Core.instance
        const server = serverManager.getServer(name)
        server?.deletePlugin(fileName)
        return 'Plugin deleted'
    }),

    /**
     * File system actions
     */
    new Action('MINECRAFT_SERVER_FILE_ALL', SYSTEM_PERMISSIONS.SYSTEM_MINECRAFT_SERVER_FILE_ALL, (sender, name) => {
        const { serverManager } = Core.instance
        const server = serverManager.getServer(name)
        return server!.getFiles()
    }),
    new Action('MINECRAFT_SERVER_FILE_GET', SYSTEM_PERMISSIONS.SYSTEM_MINECRAFT_SERVER_FILE_GET, (sender, name, filename) => {
        const { serverManager } = Core.instance
        const server = serverManager.getServer(name)
        return server?.getFile(filename)
    }),
    new Action('MINECRAFT_SERVER_FILE_SAVE', SYSTEM_PERMISSIONS.SYSTEM_MINECRAFT_SERVER_FILE_SAVE, (sender, name, filename, content) => {
        const { serverManager } = Core.instance
        const server = serverManager.getServer(name)
        server?.saveFile(filename, content)
        return 'File saved'
    }),
    new Action('MINECRAFT_SERVER_FILE_DELETE', SYSTEM_PERMISSIONS.SYSTEM_MINECRAFT_SERVER_FILE_DELETE, (sender, name, filename) => {
        const { serverManager } = Core.instance
        const server = serverManager.getServer(name)
        server?.deleteFile(filename)
        return 'File deleted'
    }),
    new Action('MINECRAFT_SERVER_FILE_RENAME', SYSTEM_PERMISSIONS.SYSTEM_MINECRAFT_SERVER_FILE_RENAME, (sender, name, filename, newName) => {
        const { serverManager } = Core.instance
        const server = serverManager.getServer(name)
        server?.renameFile(filename, newName)
        return 'File renamed'
    }),
]
