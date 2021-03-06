export default (file: File, acceptedFiles: string | string[]) => {
    if (file && acceptedFiles) {
        const acceptedFilesArray = Array.isArray(acceptedFiles) ? acceptedFiles : acceptedFiles.split(',')
        const fileName = file.name || ''
        const mimeType = (file.type || '').toLowerCase()
        const baseMimeType = mimeType.replace(/\/.*$/, '')

        return acceptedFilesArray.some((type) => {
            const validType = type.trim().toLowerCase()
            if (validType.charAt(0) === '.') {
                return fileName.toLowerCase().endsWith(validType)
            } else if (validType.endsWith('/*')) {
                return baseMimeType === validType.replace(/\/.*$/, '')
            }
            return mimeType === validType
        })
    }
    return true
}
