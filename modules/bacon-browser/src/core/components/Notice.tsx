import { Notification } from 'baseui/notification'
import { ToastProps } from 'baseui/toast'
import React from 'react'
import { styled } from 'styletron-react'

const Container = styled('div', {
  position: 'fixed',
  left: '10px',
  bottom: '10px',
})

export class Notice extends React.Component<
  any,
  {
    node?: React.ReactNode
  }
> {
  constructor(props: any) {
    super(props)
    this.state = {
      node: undefined,
    }

    handler = this.handler.bind(this)
  }

  private handler(msg: string, kind: ToastProps['kind'], autoHideDuration = 5000) {
    return new Promise<void>((resolve) => {
      this.setState(
        {
          node: undefined,
        },
        () => {
          this.setState(
            {
              node: (
                <Container>
                  <Notification kind={kind} autoHideDuration={autoHideDuration} closeable>
                    {msg}
                  </Notification>
                </Container>
              ),
            },
            () => resolve(),
          )
        },
      )
    })
  }

  public render() {
    return <>{this.state.node}</>
  }
}

let handler: (msg: string, kind: ToastProps['kind'], autoHideDuration?: number) => Promise<void>
export const showNotification = (msg: string, kind: ToastProps['kind'], autoHideDuration?: number) =>
  handler.bind(Notice)(msg, kind, autoHideDuration)
