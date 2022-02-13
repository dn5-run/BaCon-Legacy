import { styled } from 'baseui'
import { AppNavBar, NavItemT, setItemActive } from 'baseui/app-nav-bar'
import React, { isValidElement, useState } from 'react'

import { Confirmation, showConfirmation } from './components/Confirmation'
import { Notice, showNotification } from './components/Notice'
import { store } from './store'
import { Loading } from './windows/Loading'
import { Login } from './windows/Login'
import { ServerSoftList } from './windows/ServerSoft'
import { Servers } from './windows/Servers'

const Container = styled('div', ({ $theme }) => ({
  minHeight: '100vh',
  backgroundColor: $theme.colors.backgroundSecondary,
}))

export const Main: React.VFC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(store.client.isAuthorized)
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
          await store.client.logout()
          setIsLoggedIn(false)
        },
      },
    },
  ])

  toggler = (node) => {
    setContent(node)
  }

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
          } else showNotification('You are not logged in.', 'warning')
        }}
      />

      {online ? isLoggedIn ? content : <Login onLogin={() => setIsLoggedIn(true)} /> : <Loading onOnline={() => setOnline(true)} />}

      <Notice />
      <Confirmation />
    </Container>
  )
}

let toggler: (content: React.ReactNode) => void
export const toggleMain = (content: React.ReactNode) => toggler.bind(Main)(content)
