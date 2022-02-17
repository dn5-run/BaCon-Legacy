import { styled } from 'baseui'
import { Button } from 'baseui/button'
import { Input } from 'baseui/input'
import { HeadingLarge } from 'baseui/typography'
import React, { useState } from 'react'
import { useBaCon } from '../../../BaCon/BaConProvider'

import { useNotification } from '../../components/Notification'

const Container = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80vh',
  width: '100%',
  flexWrap: 'wrap',
  textAlign: 'center',
})

const Block = styled('div', ({ $theme }) => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    width: '90%',
    [$theme.mediaQuery.medium]: {
      width: '25%',
    },
  }
})

export const Login: React.VFC<{
  onLogin: () => void
}> = ({ onLogin }) => {
  const client = useBaCon()
  const notice = useNotification()
  
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  return (
    <Container>
      <Block>
        <HeadingLarge>Login</HeadingLarge>
        <Input
          placeholder="Username"
          type="email"
          value={username}
          onChange={(e) => {
            setUsername(e.currentTarget.value)
          }}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.currentTarget.value)
          }}
        />
        <Button
          isLoading={isLoading}
          onClick={async () => {
            setIsLoading(true)
            try {
              await client.login(username, password)
              onLogin()
            } catch (error) {
              notice.warning('Invalid username or password.', {})
              setIsLoading(false)
            }
          }}
        >
          Login
        </Button>
      </Block>
    </Container>
  )
}
