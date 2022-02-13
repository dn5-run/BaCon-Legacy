import { useStyletron } from 'baseui'
import { Tab, TabOverrides, Tabs } from 'baseui/tabs-motion'
import React, { useEffect, useState } from 'react'

import { ServerProps } from '../..'
import { Config } from './Config'
import { Console } from './Console'
import { Controller } from './Controller'
import { Plugins } from './Plugins'
import { Summary } from './Summary'

const TabOverrides: TabOverrides = {
  TabPanel: {
    style: {
      maxHeight: '75vh',
      overflow: 'auto',
    }
  }
}

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
        orientation="horizontal"
        overrides={{
          TabList: {
            style: ({ $theme }) => ({
              backgroundColor: $theme.colors.backgroundPrimary,
            })
          }
        }}
      >
        <Tab title="Console" overrides={TabOverrides}>
          <Console server={server} />
        </Tab>
        <Tab title="config" overrides={TabOverrides}>
          <Config server={server} />
        </Tab>
        <Tab title="plugins" overrides={TabOverrides}>
          <Plugins server={server} />
        </Tab>
      </Tabs>
    </div>
  )
}
