import { BaseProvider, DarkTheme } from 'baseui'
import { Chart as ChartJS, registerables } from 'chart.js'
import { Client as Styletron } from 'styletron-engine-atomic'
import { Provider as StyletronProvider, styled } from 'styletron-react'

import { ConfirmationProvider } from './components/confirmation'
import { NotificationProvider } from './components/notification'
import { BaConProvider } from './futures/bacon/bacon-provider'

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
