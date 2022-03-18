import { useConfirmation } from '@/components/confirmation'
import { FileStat } from 'bacon-types'
import { useStyletron } from 'baseui'
import { useState } from 'react'

import { useServer } from '../..'
import { Editor } from './editor'
import { Explorer } from './explorer'

export const File: React.VFC = () => {
  const [server] = useServer()
  const [css] = useStyletron()
  const [file, setFile] = useState<FileStat | undefined>()
  const [content, setContent] = useState('')
  const showConfirmation = useConfirmation()

  const onSelect = async (file: FileStat) => {
    const result = file.isBinary ? await showConfirmation('Binary file', 'This file is binary. Do you want to open it?') : true
    if (result && file.isFile) {
      const data = await server.getFile(file.path)
      setFile(file)
      setContent(`${data}`)
    }
  }

  return (
    <div
      className={css({
        display: 'flex',
      })}
    >
      <Explorer onSelect={onSelect} />
      <Editor
        content={content}
        filepath={file?.path || ''}
        onSave={(c) => {
          if (file) {
            server.saveFile(file.path, c)
          }
        }}
      />
    </div>
  )
}
