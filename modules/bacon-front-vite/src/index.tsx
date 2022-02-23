import React from 'react'
import ReactDOM from 'react-dom'

import { client } from './BaCon/BaConProvider'
import { _App } from './core/_App'

export class Main {
  constructor() {
    this.init(document.getElementById('root') as HTMLElement)
  }

  public async init(parent: HTMLElement) {
    try {
      await client.auth()
    } catch (error) {
      //ignore
    }
    ReactDOM.render(<_App />, parent)
  }
}

new Main()
