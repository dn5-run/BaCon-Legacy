import { Main } from './main'
import { Providers } from './providers'

export const _App: React.VFC = () => {
  return (
    <Providers>
      <Main />
    </Providers>
  )
}
