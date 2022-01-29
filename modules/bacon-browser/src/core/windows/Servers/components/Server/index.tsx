import { useStyletron } from 'baseui'
import { Tab, Tabs } from 'baseui/tabs-motion'
import React, { useEffect, useState } from 'react'

import { ServerProps } from '../..'
import { Config } from './Config'
import { Console } from './Console'
import { Controller } from './Controller'
import { Plugins } from './Plugins'
import { Summary } from './Summary'

export const ServerFC: React.VFC<ServerProps> = ({ server }) => {
  const [css] = useStyletron()

  const [activeKey, setActiveKey] = useState<React.Key>('0')

  useEffect(() => {
    const startHandler = () => {
      setActiveKey('1')
    }
    server.on('preStart', startHandler)

    return () => {
      server.off('preStart', startHandler)
    }
  })

  return (
    <div
      className={css({
        margin: '1rem',
      })}
    >
      <Controller server={server} />
      <Tabs
        activeKey={activeKey}
        onChange={({ activeKey }) => {
          setActiveKey(activeKey)
        }}
        activateOnFocus
        orientation="vertical"
      >
        <Tab title="Summary">
          <Summary server={server} />
        </Tab>
        <Tab title="Console">
          <Console server={server} />
        </Tab>
        <Tab title="config">
          <Config server={server} />
        </Tab>
        <Tab title="plugins">
          <Plugins server={server} />
        </Tab>
      </Tabs>
    </div>
  )
}
