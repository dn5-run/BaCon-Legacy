import { useBaCon } from '@/futures/bacon/bacon-provider'
import { isProgressStatusData, SystemStatusData } from 'bacon-types'
import { ProgressBar } from 'baseui/progress-bar'
import { useEffect, useState } from 'react'

export const DownloadTask: React.VFC<{
  name: string
  onComplete?: () => void
}> = ({ name, onComplete }) => {
  const client = useBaCon()

  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(0)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const handler = (status: SystemStatusData) => {
      if (status.key !== `download.${name}`) return
      if (status.title === 'complete' && onComplete) onComplete()
      if (isProgressStatusData(status.data)) {
        setTotal(Math.round((status.data.total / 1024 / 1024) * 100) / 100)
        setCurrent(Math.round((status.data.current / 1024 / 1024) * 100) / 100)
        setProgress(Math.round((status.data.current / status.data.total) * 100))
      }
    }
    client.socket.on('status', handler)
    return () => {
      client.socket.off('status', handler)
    }
  }, [])
  return (
    <div>
      <ProgressBar value={progress} getProgressLabel={() => `${current}mb out of ${total}mb downloaded`} showLabel />
    </div>
  )
}
