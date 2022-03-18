import { styled } from 'baseui'
import { Checkbox, LABEL_PLACEMENT } from 'baseui/checkbox'
import { Input } from 'baseui/input'
import { ParagraphSmall } from 'baseui/typography'
import { useEffect, useRef, useState } from 'react'

import { useServer } from '../..'

const ConsoleContainer = styled('div', ({ $theme }) => ({
  backgroundColor: $theme.colors.backgroundAlt,
  height: '65vh',
  width: '100%',
  overflowY: 'auto',
  overflowX: 'hidden',
}))

export const Console: React.VFC = () => {
  const [server] = useServer()
  const ref = useRef<HTMLDivElement>(null)
  const [logStr, setLogStr] = useState<string[]>([])
  const [autoScroll, setAutoScroll] = useState(true)

  useEffect(() => {
    ;(async () => {
      const logArray = (await server.getLogs()).split(/\r\n|\n|\r/).slice(-40)
      setLogStr(logArray)
      if (ref.current && autoScroll) ref.current.scrollTop = ref.current.scrollHeight
    })()

    const logHandler = (log: string) => {
      setLogStr((l) => [...l, ...log.split(/\r\n|\n|\r/)])
      if (ref.current && autoScroll) ref.current.scrollTop = ref.current.scrollHeight
    }
    const startHandler = () => {
      setLogStr([])
    }

    server.on('log', logHandler)
    server.on('start', startHandler)

    return () => {
      server.off('log', logHandler)
      server.off('start', startHandler)
    }
  }, [])

  return (
    <>
      <ConsoleContainer ref={ref}>
        {logStr.map((log, i) => (
          <ParagraphSmall key={log + i}>{log}</ParagraphSmall>
        ))}
      </ConsoleContainer>
      <Input
        startEnhancer="/"
        size="compact"
        onKeyPress={async (e) => {
          if (e.key === 'Enter' && Object.keys(e.currentTarget.value).length > 0) {
            const command = e.currentTarget.value
            e.currentTarget.value = ''
            await server.command(command)
          }
        }}
      />
      <Checkbox checked={autoScroll} onChange={(e) => setAutoScroll(e.currentTarget.checked)} labelPlacement={LABEL_PLACEMENT.right}>
        AutoScroll
      </Checkbox>
    </>
  )
}
