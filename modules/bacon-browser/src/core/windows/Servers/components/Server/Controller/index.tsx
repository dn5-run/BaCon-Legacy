import { useStyletron } from 'baseui'
import { Button } from 'baseui/button'
import { ButtonGroup } from 'baseui/button-group'
import React, { useState } from 'react'
import { VscArrowLeft } from 'react-icons/vsc'

import { ServerProps, toggleServer } from '../../..'

export const Controller: React.VFC<ServerProps> = ({ server }) => {
  const [css] = useStyletron()

  const [startIsLoading, setStartIsLoading] = useState(false)
  const [stopIsLoading, setStopIsLoading] = useState(false)
  const [restartIsLoading, setRestartIsLoading] = useState(false)
  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '1rem',
      })}
    >
      <ButtonGroup>
        <Button
          onClick={() => {
            toggleServer()
          }}
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
          onClick={async () => {
            setStartIsLoading(true)
            await server.start()
            setStartIsLoading(false)
          }}
        >
          Start
        </Button>
        <Button
          isLoading={stopIsLoading}
          onClick={async () => {
            setStopIsLoading(true)
            await server.stop()
            setStopIsLoading(false)
          }}
        >
          Stop
        </Button>
        <Button
          isLoading={restartIsLoading}
          onClick={async () => {
            setRestartIsLoading(true)
            await server.restart()
            setRestartIsLoading(false)
          }}
        >
          Restart
        </Button>
      </ButtonGroup>
    </div>
  )
}
