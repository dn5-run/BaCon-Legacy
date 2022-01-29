import { BaseProvider, DarkTheme } from 'baseui'
import { Chart as ChartJS, registerables } from 'chart.js'
import React from 'react'
import { Client as Styletron } from 'styletron-engine-atomic'
import { Provider as StyletronProvider, styled } from 'styletron-react'

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
        <Container>{children}</Container>
      </BaseProvider>
    </StyletronProvider>
  )
}
