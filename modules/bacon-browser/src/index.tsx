import React from 'react'
import ReactDOM from 'react-dom'

import { _App } from './core/_App'
import { store } from './core/store'

class Core {
  constructor() {
    this.init(document.getElementById('root') as HTMLElement)
  }

  public async init(parent: HTMLElement) {
    try {
      await store.client.auth()
    } catch (error) {
      //ignore
    }
    ReactDOM.render(<_App />, parent)
  }
}

new Core()

//eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
if (module.hot) module.hot.accept()
