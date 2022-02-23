import { BaseProvider, DarkTheme } from 'baseui'
import { Chart as ChartJS, registerables } from 'chart.js'
import React from 'react'
import { Client as Styletron } from 'styletron-engine-atomic'
import { Provider as StyletronProvider, styled } from 'styletron-react'

import { BaConProvider } from '../BaCon/BaConProvider'
import { ConfirmationProvider } from './components/Confirmation'
import { NotificationProvider } from './components/Notification'

ChartJS.register(...registerables)
const engine = new Styletron()

const Container = styled('div', {
  minHeight: '100vh',
  backgroundColor: '#141414',
  overflow: 'hidden',
})

export const Providers: React.FC = ({ children }) => {
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={DarkTheme}>
        <BaConProvider>
          <NotificationProvider>
            <ConfirmationProvider>
              <Container>{children}</Container>
            </ConfirmationProvider>
          </NotificationProvider>
        </BaConProvider>
      </BaseProvider>
    </StyletronProvider>
  )
}
