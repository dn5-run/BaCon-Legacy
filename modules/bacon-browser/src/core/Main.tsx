import { styled } from 'baseui'
import { AppNavBar, NavItemT } from 'baseui/app-nav-bar'
import React, { isValidElement, useState } from 'react'

import { Confirmation, showConfirmation } from './components/Confirmation'
import { Notice, showNotification } from './components/Notice'
import { store } from './store'
import { Login } from './windows/Login'
import { ServerSoftList } from './windows/ServerSoft'
import { Servers } from './windows/Servers'

const Container = styled('div', ({ $theme }) => ({
  minHeight: '100vh',
  backgroundColor: $theme.colors.backgroundSecondary,
}))

export const Main: React.VFC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(store.client.isAuthorized)
  const [content, setContent] = useState<React.ReactNode>(<Servers />)
  const [mainItems] = useState<NavItemT[]>([
    { label: 'Servers', info: <Servers /> },
    { label: 'ServerSoft', info: <ServerSoftList /> },
    {
      label: 'Logout',
      info: async () => {
        if (!(await showConfirmation('Logout', 'Are you sure you want to logout?'))) return
        await store.client.logout()
        setIsLoggedIn(false)
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
          if (isLoggedIn) {
            if (isValidElement(item.info)) setContent(item.info)
            if (typeof item.info === 'function') item.info()
          } else showNotification('You are not logged in.', 'warning')
        }}
      />

      {isLoggedIn ? content : <Login onLogin={() => setIsLoggedIn(true)} />}

      <Notice />
      <Confirmation />
    </Container>
  )
}

let toggler: (content: React.ReactNode) => void
export const toggleMain = (content: React.ReactNode) => toggler.bind(Main)(content)
