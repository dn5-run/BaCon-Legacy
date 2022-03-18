import { useNotification } from '@/components/notification'
import { Server } from 'bacon-client'
import { useStyletron } from 'baseui'
import { Tab, TabOverrides, Tabs } from 'baseui/tabs-motion'
import { createContext, useContext, useEffect, useState } from 'react'

import { Config } from './tabs/config'
import { Console } from './tabs/console'
import { Controller } from './tabs/controller'
import { File } from './tabs/file'
import { Plugins } from './tabs/plugins'

const tabOverrides: TabOverrides = {
  TabPanel: {
    style: {
      maxHeight: '75vh',
      overflow: 'auto',
    },
  },
}

export const ServerContext = createContext({} as Server)
export const useServer = () => {
  const server = useContext(ServerContext)
  const notice = useNotification()
  const start = async () => {
    try {
      await server.start()
      notice.positive('Server started', {})
    } catch (error) {
      notice.negative(typeof error === 'string' ? error : 'Failed to start the server.', {})
    }
  }
  const stop = async () => {
    try {
      await server.stop()
      notice.positive('Server stopped', {})
    } catch (error) {
      notice.negative(typeof error === 'string' ? error : 'Failed to stop the server.', {})
    }
  }
  return [server, start, stop] as const
}

export const ServerFC: React.VFC<{ server: Server }> = ({ server }) => {
  const [css] = useStyletron()
  const [activeKey, setActiveKey] = useState<React.Key>('0')

  useEffect(() => {
    const startHandler = () => {
      setActiveKey('0')
    }
    server.on('preStart', startHandler)

    return () => {
      server.off('preStart', startHandler)
    }
  })

  return (
    <ServerContext.Provider value={server}>
      <div
        className={css({
          margin: '1rem',
        })}
      >
        <Controller />
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
              }),
            },
          }}
        >
          <Tab title="console" overrides={tabOverrides}>
            <Console />
          </Tab>
          <Tab title="config" overrides={tabOverrides}>
            <Config />
          </Tab>
          <Tab title="plugins" overrides={tabOverrides}>
            <Plugins />
          </Tab>
          <Tab title="file" overrides={tabOverrides}>
            <File />
          </Tab>
        </Tabs>
      </div>
    </ServerContext.Provider>
  )
}
