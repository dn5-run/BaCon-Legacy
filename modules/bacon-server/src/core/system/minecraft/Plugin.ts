import AdmZip from 'adm-zip'
import { PluginType, PluginYaml, ServerType, VelocityPluginJson } from 'bacon-types'
import fs from 'fs-extra'
import path from 'path'
import yaml from 'yaml'

export class Plugin implements PluginType {
    public readonly fileName: string
    public readonly fileSize: number
    public meta?: PluginYaml | VelocityPluginJson

    constructor(public readonly filePath: string, type: ServerType) {
        if (!this.filePath.endsWith('.jar')) throw new Error('Invalid path')
        if (!fs.existsSync(filePath)) throw new Error('Plugin not found')

        this.fileName = path.basename(this.filePath)
        this.fileSize = fs.statSync(this.filePath).size

        if (type !== 'velocity' && type !== 'other') this.checkPluginMeta()
        else this.checkVelocityPluginMeta()
    }

    private checkPluginMeta() {
        const zip = new AdmZip(this.filePath)
        const ymlEntry = zip.getEntry('plugin.yml') ?? zip.getEntry('bungee.yml')

        if (!ymlEntry) return

        const yml = ymlEntry.getData().toString()
        this.meta = yaml.parse(yml)
    }

    private checkVelocityPluginMeta() {
        const zip = new AdmZip(this.filePath)
        const jsonEntry = zip.getEntry('velocity-plugin.json')

        if (!jsonEntry) return

        const json = jsonEntry.getData().toString()
        this.meta = JSON.parse(json) as VelocityPluginJson
    }
}
