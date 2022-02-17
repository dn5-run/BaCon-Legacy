import { useStyletron } from 'baseui'
import { Button } from 'baseui/button'
import { ButtonGroup } from 'baseui/button-group'
import React, { useState } from 'react'
import { VscArrowLeft } from 'react-icons/vsc'
import { useServer } from '..'

import { useServerToggler } from '../../..'

export const Controller: React.VFC = () => {
  const [server, startServer, stopServer] = useServer()
  const [css] = useStyletron()

  const [startIsLoading, setStartIsLoading] = useState(false)
  const [stopIsLoading, setStopIsLoading] = useState(false)
  const [restartIsLoading, setRestartIsLoading] = useState(false)

  const toggleServer = useServerToggler()

  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      })}
    >
      <ButtonGroup>
        <Button
          onClick={() => toggleServer()}
        >
          <VscArrowLeft />
        </Button>
      </ButtonGroup>
      <ButtonGroup
        overrides={{
          Root: {
            style: {
              justifyContent: 'flex-end',
            },
          },
        }}
      >
        <Button
          isLoading={startIsLoading}
          disabled={startIsLoading}
          onClick={async () => {
            setStartIsLoading(true)
            await startServer()
            setStartIsLoading(false)
          }}
        >
          Start
        </Button>
        <Button
          isLoading={stopIsLoading}
          disabled={stopIsLoading}
          onClick={async () => {
            setStopIsLoading(true)
            await stopServer()
            setStopIsLoading(false)
          }}
        >
          Stop
        </Button>
        <Button
          isLoading={restartIsLoading}
          disabled={restartIsLoading}
          onClick={async () => {
            setRestartIsLoading(true)
            await stopServer()
            await startServer()
            setRestartIsLoading(false)
          }}
        >
          Restart
        </Button>
      </ButtonGroup>
    </div>
  )
}
