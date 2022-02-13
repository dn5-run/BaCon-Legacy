import { useStyletron } from 'baseui'
import { FileUploader } from 'baseui/file-uploader'
import { H2 } from 'baseui/typography'
import React, { useState } from 'react'

export const Uploader: React.VFC<{
  onUploaded?: (result: boolean) => void
}> = ({ onUploaded }) => {
  const [css, theme] = useStyletron()
  const [errorMsg, setErrorMsg] = useState<string>()
  const [isUploading, setIsUploading] = useState(false)

  const uploadFile = async (files: File[]) => {
    const formData = new FormData()
    setIsUploading(true)
    if (files.length === 0) {
      setErrorMsg('No files selected')
      return
    }
    for (const v of files) {
      formData.append('files', v)
    }
    const res = await fetch('/api/server/upload/serversoft', {
      method: 'POST',
      body: formData,
    })

    if (res && res.status === 200) {
      setErrorMsg('')
      onUploaded && onUploaded(true)
    } else {
      setErrorMsg('Upload failed')
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
      <H2>Upload Server Software</H2>
      <br />
      <FileUploader
        errorMessage={errorMsg}
        progressMessage={isUploading ? `Uploading...` : ''}
        onDropAccepted={(accepted, rejected) => {
          const reject = accepted.filter((f) => !f.name.endsWith('.jar'))
          if (reject.length > 0) {
            setErrorMsg(`${reject.map((f) => f.name).join(', ')} is not a jar file`)
          }
          uploadFile(accepted.filter((f) => f.name.endsWith('.jar')))
        }}
        overrides={{
          ButtonComponent: {
            //@ts-ignore
            BaseButton: {
              style: {
                display: isUploading ? 'none' : 'block',
              },
            },
          },
        }}
      />
      <br />
      {/* <Table
        overrides={{
          TableHeadCell: {
            style: {
              display: 'none',
            },
          },
        }}
        columns={['', '']}
        data={files.map((file, i) => [file.name, `${Math.round(file.size / 1024 / 1024 * 10) / 10}MB`])}
      /> */}
    </div>
  )
}
