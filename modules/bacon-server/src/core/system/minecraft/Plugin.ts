import AdmZip from 'adm-zip'
import { PluginType, PluginYaml } from 'bacon-types'
import fs from 'fs-extra'
import path from 'path'
import yaml from 'yaml'

export class Plugin implements PluginType {
    public readonly fileName: string
    public readonly fileSize: number
    public readonly yaml?: PluginYaml

    constructor(filePath: string) {
        if (!filePath.endsWith('.jar')) throw new Error('Invalid path')
        if (!fs.existsSync(filePath)) throw new Error('Plugin not found')

        this.fileName = path.basename(filePath)
        this.fileSize = fs.statSync(filePath).size

        const zip = new AdmZip(filePath)
        const ymlEntry = zip.getEntry('plugin.yml') ?? zip.getEntry('bungee.yml')

        if (!ymlEntry) return

        const yml = ymlEntry.getData().toString()
        this.yaml = yaml.parse(yml)
    }
}
