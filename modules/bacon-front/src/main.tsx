import { SystemStatusData } from 'bacon-types'
import { styled } from 'baseui'
import { AppNavBar, NavItemT, setItemActive } from 'baseui/app-nav-bar'
import { createContext, isValidElement, useContext, useEffect, useState } from 'react'

import { useConfirmation } from './components/confirmation'
import { useNotification } from './components/notification'
import { useBaCon } from './futures/bacon/bacon-provider'
import { Loading } from './windows/loading'
import { Login } from './windows/login'
import { ServerSoftList } from './windows/server-soft'
import { Servers } from './windows/servers'

const Container = styled('div', ({ $theme }) => ({
  minHeight: '100vh',
  backgroundColor: $theme.colors.backgroundSecondary,
}))

const ToggleMainContext = createContext((node: React.ReactNode) => {})
export const toggleMain = (node: React.ReactNode) => {
  const setter = useContext(ToggleMainContext)
  setter(node)
}

export const Main: React.VFC = () => {
  const client = useBaCon()
  const notice = useNotification()
  const showConfirmation = useConfirmation()

  const [isLoggedIn, setIsLoggedIn] = useState(client.isAuthorized)
  const [online, setOnline] = useState(false)
  const [content, setContent] = useState<React.ReactNode>(<Servers />)
  const [mainItems, setMainItems] = useState<NavItemT[]>([
    { label: 'Servers', info: { node: <Servers /> } },
    { label: 'ServerSoft', info: { node: <ServerSoftList /> } },
    {
      label: 'Logout',
      info: {
        action: async () => {
          if (!(await showConfirmation('Logout', 'Are you sure you want to logout?'))) return
          await client.logout()
          setIsLoggedIn(false)
        },
      },
    },
  ])

  const onShutdown = async () => {
    client.logout()
    setIsLoggedIn(false)
    setOnline(false)
  }
  useEffect(() => {
    const handler = (status: SystemStatusData) => {
      status.key === 'shutdown' && onShutdown()
    }
    client.socket.on('status', handler)

    return () => {
      client.socket.off('status', handler)
    }
  })

  return (
    <Container>
      <AppNavBar
        title="BaCon"
        mainItems={mainItems}
        onMainItemSelect={(item) => {
          setMainItems((prev) => setItemActive(prev, item))
          if (isLoggedIn) {
            if (isValidElement(item.info.node)) setContent(item.info.node)
            if (typeof item.info.action === 'function') item.info.action()
          } else notice.warning('You are not logged in.', {})
        }}
      />

      <ToggleMainContext.Provider value={setContent}>
        {online ? isLoggedIn ? content : <Login onLogin={() => setIsLoggedIn(true)} /> : <Loading onOnline={() => setOnline(true)} />}
      </ToggleMainContext.Provider>
    </Container>
  )
}
