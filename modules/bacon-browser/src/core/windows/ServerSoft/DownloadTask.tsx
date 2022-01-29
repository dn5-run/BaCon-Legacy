import { isProgressStatusData, SystemStatusData } from 'bacon-types'
import { ProgressBar } from 'baseui/progress-bar'
import React, { useEffect } from 'react'

import { store } from '../../store'

export const DownloadTask: React.VFC<{
  name: string
  onComplete?: () => void
}> = ({ name, onComplete }) => {
  const [total, setTotal] = React.useState(0)
  const [current, setCurrent] = React.useState(0)
  const [progress, setProgress] = React.useState(0)
  useEffect(() => {
    const handler = (status: SystemStatusData) => {
      if (status.key !== `soft.${name}`) return
      if (status.title === 'complete' && onComplete) onComplete()
      if (isProgressStatusData(status.data)) {
        setTotal(Math.round((status.data.total / 1024 / 1024) * 100) / 100)
        setCurrent(Math.round((status.data.current / 1024 / 1024) * 100) / 100)
        setProgress(Math.round((status.data.current / status.data.total) * 100))
      }
    }
    store.client.socket.on('status', handler)
    return () => {
      store.client.socket.off('status', handler)
    }
  }, [])
  return (
    <div>
      <ProgressBar value={progress} getProgressLabel={() => `${current}mb out of ${total}mb downloaded`} showLabel />
    </div>
  )
}
