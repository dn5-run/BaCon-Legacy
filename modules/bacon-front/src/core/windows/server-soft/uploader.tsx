import { useStyletron } from 'baseui'
import { FileUploader } from 'baseui/file-uploader'
import { toaster } from 'baseui/toast'
import { H2 } from 'baseui/typography'
import { useState } from 'react'

export const Uploader: React.VFC<{
  onUploaded?: (result: boolean) => void
}> = ({ onUploaded }) => {
  const [css] = useStyletron()
  const [isUploading, setIsUploading] = useState(false)

  const uploadFile = async (files: File[]) => {
    const formData = new FormData()
    setIsUploading(true)
    if (files.length === 0) {
      toaster.negative('No file selected', {})
      return
    }

    for (const v of files) {
      if(!v.name.endsWith('.jar')) {
        toaster.negative(`${v.name} is not a valid plugin`, {})
        continue
      }
      formData.append('files', v)
    }
    if(formData.getAll('files').length === 0) {
      setIsUploading(false)
      return
    }
    const res = await fetch('/api/server/upload/serversoft', {
      method: 'POST',
      body: formData,
    })

    if (res && res.status === 200) {
      toaster.positive('Uploaded successfully', {})
      onUploaded && onUploaded(true)
    } else {
      toaster.negative('Failed to upload', {})
      onUploaded && onUploaded(false)
    }

    setIsUploading(false)
  }
  return (
    <div
      className={css({
        margin: '2rem',
      })}
    >
      <H2>Upload</H2>
      <br />
      <FileUploader
        progressMessage={isUploading ? `Uploading...` : ''}
        onDropAccepted={(accepted, rejected) => {
          uploadFile(accepted)
        }}
      />
    </div>
  )
}
