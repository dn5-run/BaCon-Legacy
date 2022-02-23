import React from 'react'

import { Main } from './Main'
import { Providers } from './Providers'

export const _App: React.VFC = () => {
  return (
    <Providers>
      <Main />
    </Providers>
  )
}
