import { useStyletron } from 'baseui'
import { Card } from 'baseui/card'
import { ProgressBar } from 'baseui/progress-bar'
import { ParagraphMedium } from 'baseui/typography'
import { useEffect, useState } from 'react'
import { styled } from 'styletron-react'

import { useServer } from '../..'

const StyledCard = styled(Card, {
  width: '100%',
  height: '100%',
})

const StatusItem: React.VFC<{
  data: [string, string]
}> = ({ data }) => {
  const [css] = useStyletron()
  return (
    <div
      className={css({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      })}
    >
      <ParagraphMedium>{data[0]}</ParagraphMedium>
      <ParagraphMedium>{data[1]}</ParagraphMedium>
    </div>
  )
}

export const Status: React.VFC = () => {
  const [server] = useServer()
  const [css] = useStyletron()

  //hooks
  const [status, setStatus] = useState(false)
  const [cpuUsage, setCpuUsage] = useState(0)
  const [ramUsage, setRamUsage] = useState(0)

  useEffect(() => {
    const intervalHandler = async () => {
      const data = await server.getStatus()
      setStatus(data.status)
      setCpuUsage(data.status ? data.cpuUsage : 0)
      setRamUsage(data.status ? data.memoryUsage : 0)
    }
    intervalHandler()
    const interval = setInterval(intervalHandler, 2000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <StyledCard>
      <div
        className={css({
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        })}
      >
        <div
          className={css({
            display: 'inline-block',
            width: '70%',
          })}
        >
          <StatusItem data={['Status', status ? 'running' : 'stopped']} />

          <StatusItem data={['CPU usage', `${Math.round(cpuUsage * 10) / 10}%`]} />
          <ProgressBar value={cpuUsage} successValue={100} />
          <StatusItem data={['Memory usage', `${Math.round((ramUsage / 1024 / 1024) * 10) / 10}MB`]} />
          <ProgressBar value={ramUsage} successValue={server.maxMemory * 1024 * 1024} />
        </div>
      </div>
    </StyledCard>
  )
}
