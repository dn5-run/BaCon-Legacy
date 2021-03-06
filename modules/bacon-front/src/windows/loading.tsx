import { useBaCon } from '@/futures/bacon/bacon-provider'
import { ServerStatusDetail } from 'bacon-types'
import { useStyletron } from 'baseui'
import { Spinner } from 'baseui/spinner'
import { H1, Paragraph1 } from 'baseui/typography'
import { useEffect, useState } from 'react'

export const Loading: React.VFC<{
  onOnline?: () => void
}> = ({ onOnline }) => {
  const client = useBaCon()
  const [css, theme] = useStyletron()
  const [status, setStatus] = useState<typeof ServerStatusDetail[number]>()

  const updateStatus = async () => {
    try {
      const status = await client.getStatus()
      setStatus(status)
      status === 'online' && onOnline && onOnline()
    } catch (error) {
      setStatus('offline')
    }
  }
  useEffect(() => {
    const interval = setInterval(updateStatus, 1000)
    updateStatus()
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div
      className={css({
        height: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <div>
        <H1>
          Loading <Spinner />
        </H1>
        <Paragraph1>Current status : {status}</Paragraph1>
      </div>
    </div>
  )
}
