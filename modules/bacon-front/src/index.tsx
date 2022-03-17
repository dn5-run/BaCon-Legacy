import ReactDOM from 'react-dom'

import { _App } from './_app'
import { client } from './futures/bacon/bacon-provider'

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
