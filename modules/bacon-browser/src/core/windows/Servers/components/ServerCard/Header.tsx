import { ServerStatus } from 'bacon-types'
import { useStyletron } from 'baseui'
import { Button } from 'baseui/button'
import { ButtonGroup } from 'baseui/button-group'
import { HeadingSmall, ParagraphMedium } from 'baseui/typography'
import React, { useState } from 'react'
import { FaServer } from 'react-icons/fa'
import { VscAdd, VscDebugRestart, VscDebugStart, VscDebugStop, VscRemove } from 'react-icons/vsc'

import { ServerProps, toggleServer } from '../..'

export const Header: React.VFC<
  ServerProps & { refObj: React.RefObject<HTMLDivElement>; status: ServerStatus; isOpen: boolean; setIsOpen: (isOpen: boolean) => void }
> = ({ refObj, status, server, isOpen, setIsOpen }) => {
  const [css] = useStyletron()
  const flex = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  })

  const [startIsLoading, setStartIsLoading] = useState(false)
  const [stopIsLoading, setStopIsLoading] = useState(false)
  const [restartIsLoading, setRestartIsLoading] = useState(false)

  return (
    <div ref={refObj}>
      <div className={flex}>
        <HeadingSmall>
          <FaServer /> {server.name}
        </HeadingSmall>
        <div className={flex}>
          <ButtonGroup size="mini">
            <Button
              onClick={() => {
                toggleServer(server.name)
              }}
            >
              Open Controller
            </Button>
            <Button
              isLoading={startIsLoading}
              onClick={async () => {
                setStartIsLoading(true)
                await server.start()
                setStartIsLoading(false)
              }}
            >
              <VscDebugStart />
            </Button>
            <Button
              isLoading={stopIsLoading}
              onClick={async () => {
                setStopIsLoading(true)
                await server.stop()
                setStopIsLoading(false)
              }}
            >
              <VscDebugStop />
            </Button>
            <Button
              isLoading={restartIsLoading}
              onClick={async () => {
                setRestartIsLoading(true)
                await server.restart()
                setRestartIsLoading(false)
              }}
            >
              <VscDebugRestart />
            </Button>
          </ButtonGroup>
          <ButtonGroup size="mini" kind="primary">
            <Button size="mini" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <VscRemove /> : <VscAdd />}
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <>
        {status.status ? (
          <ParagraphMedium>
            <b>CPU</b>: {status.cpuUsage}% | <b>RAM</b>: {status.memoryUsage} MB | <b>Players</b> : 0
          </ParagraphMedium>
        ) : (
          <ParagraphMedium>
            <b>CPU</b>: 0% | <b>RAM</b>: 0MB | <b>Players</b> : 0
          </ParagraphMedium>
        )}
      </>
    </div>
  )
}
