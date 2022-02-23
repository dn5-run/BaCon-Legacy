import { styled } from 'baseui'
import { AppNavBar, NavItemT, setItemActive } from 'baseui/app-nav-bar'
import React, { createContext, isValidElement, useContext, useState } from 'react'

import { useBaCon } from '../BaCon/BaConProvider'
import { useConfirmation } from './components/Confirmation'
import { useNotification } from './components/Notification'
import { Loading } from './windows/Loading'
import { Login } from './windows/Login'
import { ServerSoftList } from './windows/ServerSoft'
import { Servers } from './windows/Servers'

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
    {
      label: 'Test',
      info: {
        action: async () => {
          notice.info('Test', {})
        },
      },
    },
  ])
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
