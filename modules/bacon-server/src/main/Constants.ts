import path from 'path';


export const Constants = new (class {
    public readonly DATA_PATH =
        process.platform === 'win32'
            ? path.join(process.env.APPDATA as string, '.bacon')
            : process.platform === 'darwin'
            ? path.join(process.env.HOME as string, 'Library', 'Application Support', 'BaCon')
            : path.join(process.env.HOME as string, '.bacon')

    public readonly TEMP_DIR = path.join(this.DATA_PATH, 'temp')
})()
