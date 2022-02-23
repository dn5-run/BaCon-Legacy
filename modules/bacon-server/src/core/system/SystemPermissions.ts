import { Permission } from './Auth/Permission'

export const SYSTEM_PERMISSIONS = {
    SYSTEM_USER_CREATE: new Permission('system.user.create'),
    SYSTEM_USER_DELETE: new Permission('system.user.delete'),
    SYSTEM_USER_UPDATE: new Permission('system.user.update'),
    SYSTEM_USER_LIST: new Permission('system.user.list'),

    SYSTEM_ROLE_CREATE: new Permission('system.role.create'),
    SYSTEM_ROLE_DELETE: new Permission('system.role.delete'),
    SYSTEM_ROLE_UPDATE: new Permission('system.role.update'),
    SYSTEM_ROLE_LIST: new Permission('system.role.list'),

    SYSTEM_PERMISSION_CREATE: new Permission('system.permission.create'),
    SYSTEM_PERMISSION_DELETE: new Permission('system.permission.delete'),
    SYSTEM_PERMISSION_UPDATE: new Permission('system.permission.update'),
    SYSTEM_PERMISSION_LIST: new Permission('system.permission.list'),

    SYSTEM_MINECRAFT_SERVER_CREATE: new Permission('system.minecraft.server.create'),
    SYSTEM_MINECRAFT_SERVER_DELETE: new Permission('system.minecraft.server.delete'),
    SYSTEM_MINECRAFT_SERVER_UPDATE: new Permission('system.minecraft.server.update'),
    SYSTEM_MINECRAFT_SERVER_GET: new Permission('system.minecraft.server.get'),
    SYSTEM_MINECRAFT_SERVER_LIST: new Permission('system.minecraft.server.list'),
    SYSTEM_MINECRAFT_SERVER_START: new Permission('system.minecraft.server.start'),
    SYSTEM_MINECRAFT_SERVER_STOP: new Permission('system.minecraft.server.stop'),
    SYSTEM_MINECRAFT_SERVER_STATUS: new Permission('system.minecraft.server.status'),
    SYSTEM_MINECRAFT_SERVER_COMMAND: new Permission('system.minecraft.server.command'),
    SYSTEM_MINECRAFT_SERVER_GET_PROPERTIES: new Permission('system.minecraft.server.get.properties'),
    SYSTEM_MINECRAFT_SERVER_SAVE_PROPERTIES: new Permission('system.minecraft.server.save.properties'),
    SYSTEM_MINECRAFT_SERVER_DOWNLOAD_PLUGIN: new Permission('system.minecraft.server.download.plugin'),
    SYSTEM_MINECRAFT_SERVER_GET_PLUGINS: new Permission('system.minecraft.server.get.plugins'),
    SYSTEM_MINECRAFT_SERVER_REMOVE_PLUGIN: new Permission('system.minecraft.server.remove.plugin'),

    SYSTEM_MINECRAFT_SOFT_DOWNLOAD: new Permission('system.minecraft.soft.download'),
    SYSTEM_MINECRAFT_SOFT_DELETE: new Permission('system.minecraft.soft.delete'),
    SYSTEM_MINECRAFT_SOFT_GET: new Permission('system.minecraft.soft.get'),
} as const
