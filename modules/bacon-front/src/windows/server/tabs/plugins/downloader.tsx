import { useNotification } from '@/components/notification'
import { useStyletron } from 'baseui'
import { Button } from 'baseui/button'
import { Input } from 'baseui/input'
import { HeadingMedium, HeadingXSmall, ParagraphLarge, ParagraphMedium } from 'baseui/typography'
import { useState } from 'react'

import { useServer } from '../..'
import { DownloadTask } from './download-task'

export const Downloader: React.VFC<{
  onDownloaded?: () => void
}> = ({ onDownloaded }) => {
  const [server] = useServer()
  const notice = useNotification()

  const [css] = useStyletron()

  const [tasks, setTasks] = useState<string[]>([])
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [size, setSize] = useState('-')
  const [mime, setMime] = useState('-')

  const [queryButtonIsLoading, setQueryButtonIsLoading] = useState(false)

  return (
    <div
      className={css({
        margin: '2rem',
      })}
    >
      <div>
        <HeadingMedium>Download</HeadingMedium>

        <ParagraphMedium>URL</ParagraphMedium>
        <div className={css({ display: 'flex' })}>
          <Input value={url} onChange={(e) => setUrl(e.currentTarget.value)} />
          <Button
            onClick={async () => {
              setQueryButtonIsLoading(true)
              try {
                const info = await queryURL(url)
                setName(info.name)
                setSize(`${Math.round((info.size / 1024 / 1024) * 10) / 10} MB`)
                setMime(info.mime)
              } catch (error) {
                console.error(error)
                notice.negative('Failed to query url.', {})
              }
              setQueryButtonIsLoading(false)
            }}
            size="compact"
            kind="secondary"
            isLoading={queryButtonIsLoading}
          >
            Query URL
          </Button>
        </div>

        <ParagraphMedium>Name</ParagraphMedium>
        <Input value={name} onChange={(e) => setName(e.currentTarget.value)} />

        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            margin: '1rem',
          })}
        >
          <div
            className={css({
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
            })}
          >
            <HeadingXSmall>Size: </HeadingXSmall>
            <ParagraphLarge>{size}</ParagraphLarge>
          </div>
          <div
            className={css({
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
            })}
          >
            <HeadingXSmall>Mime: </HeadingXSmall>
            <ParagraphLarge>{mime}</ParagraphLarge>
          </div>
        </div>
        <Button
          onClick={async () => {
            await server.downloadPlugin(url, name)
            setTasks((tasks) => [...tasks, name])
          }}
        >
          Download
        </Button>
      </div>
      <div>
        {tasks.map((task, i) => (
          <DownloadTask
            key={i}
            name={task}
            onComplete={() => {
              setTasks((tasks) => tasks.filter((t) => t !== task))
              setName('')
              setUrl('')
              setSize('-')
              setMime('-')
              onDownloaded && onDownloaded()
            }}
          />
        ))}
      </div>
    </div>
  )
}

const queryURL = async (rawUrl: string) => {
  const url = new URL(rawUrl)
  const res = await fetch(`/api/server/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: url.toString(),
    }),
  })
  if (res.status !== 200) throw new Error(`Invalid url: ${res.statusText}`)
  return res.json()
}
