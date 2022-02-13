import { ServerStatus } from 'bacon-types'
import { useStyletron } from 'baseui'
import { Button } from 'baseui/button'
import { ButtonGroup } from 'baseui/button-group'
import { HeadingSmall, ParagraphMedium } from 'baseui/typography'
import React, { useState } from 'react'
import { FaServer } from 'react-icons/fa'
import { VscAdd, VscCircleLargeFilled, VscDebugRestart, VscDebugStart, VscDebugStop, VscRemove, VscTerminal } from 'react-icons/vsc'

import { ServerProps, toggleServer } from '../..'

export const Header: React.VFC<
  ServerProps & { refObj: React.RefObject<HTMLDivElement>; status: ServerStatus; isOpen: boolean; setIsOpen: (isOpen: boolean) => void }
> = ({ refObj, status, server, isOpen, setIsOpen }) => {
  const [css, theme] = useStyletron()
  const flex = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    [theme.mediaQuery.large]: {
      flexWrap: 'nowrap',
    },
  })

  const [startIsLoading, setStartIsLoading] = useState(false)
  const [stopIsLoading, setStopIsLoading] = useState(false)
  const [restartIsLoading, setRestartIsLoading] = useState(false)

  return (
    <div ref={refObj}>
      <div className={flex}>
        <div>
          <HeadingSmall>
            <VscCircleLargeFilled color={status.status ? '#DEFFDF' : '#FFC6C6'} /> {server.name}
          </HeadingSmall>
          <div>
            {status.status ? (
              <ParagraphMedium>
                <b>CPU</b>: {status.cpuUsage}% | <b>RAM</b>: {status.memoryUsage} MB | <b>Players</b> : {status.players}
              </ParagraphMedium>
            ) : (
              <ParagraphMedium>
                <b>CPU</b>: 0% | <b>RAM</b>: 0MB | <b>Players</b> : N/A
              </ParagraphMedium>
            )}
          </div>
        </div>
        <div className={flex}>
          <ButtonGroup size="compact">
            <Button
              onClick={() => {
                toggleServer(server.name)
              }}
            >
              <VscTerminal />
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
          <ButtonGroup size="compact" kind="primary">
            <Button onClick={() => setIsOpen(!isOpen)}>{isOpen ? <VscRemove /> : <VscAdd />}</Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  )
}
