import { Folder } from '@/components/folder'
import { FileStat } from 'bacon-types'
import { useStyletron } from 'baseui'
import { useEffect, useState } from 'react'

import { useServer } from '../..'

export const Explorer: React.VFC<{ onSelect: (file: FileStat) => void }> = ({ onSelect }) => {
  const [css] = useStyletron()
  const [server] = useServer()
  const [dir, setDir] = useState<FileStat | undefined>()

  const updateFiles = async () => {
    const files = await server.getFiles()
    setDir(files)
  }

  useEffect(() => {
    updateFiles()
  }, [])

  return (
    <div
      className={css({
        width: '30vw',
        height: '75vh',
        overflow: 'auto',
        '::-webkit-scrollbar': {
          display: 'none',
        },
      })}
    >
      {dir && <Folder key={dir.name} onSelect={onSelect} {...dir} />}
    </div>
  )
}
