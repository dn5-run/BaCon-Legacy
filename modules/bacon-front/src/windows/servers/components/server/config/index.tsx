import { useBaCon } from '@/futures/bacon/bacon-provider'
import { useConfirmation } from '@/components/confirmation'
import { useNotification } from '@/components/notification'
import { ServerSoft, ServerType } from 'bacon-types'
import { styled } from 'baseui'
import { Button } from 'baseui/button'
import { Checkbox } from 'baseui/checkbox'
import { Input } from 'baseui/input'
import { RadioGroup, Radio } from 'baseui/radio'
import { Select } from 'baseui/select'
import { ParagraphMedium } from 'baseui/typography'
import { useEffect, useState } from 'react'

import { useServer } from '..'
import { useServerToggler } from '../../..'

const Sep = styled('div', {
  width: '100%',
  height: '1rem',
})

export const Config: React.VFC = () => {
  const client = useBaCon()
  const [server] = useServer()
  const showConfirmation = useConfirmation()
  const notice = useNotification()

  const [name, setName] = useState(server.name)
  const [type, setType] = useState<ServerType>(server.type)
  const [dir, setDir] = useState(server.dir)
  const [soft, setSoft] = useState(server.soft)
  const [softList, setSoftList] = useState<ServerSoft[]>([])
  const [port, setPort] = useState(server.port)
  const [java, setJava] = useState(server.java)
  const [maxMemory, setMaxMemory] = useState(server.maxMemory)
  const [minMemory, setMinMemory] = useState(server.minMemory)
  const [customJVMArgs, setCustomJVMArgs] = useState(server.customJVMArgs)
  const [customServerArgs, setCustomServerArgs] = useState(server.customServerArgs)
  const [autoStart, setAutoStart] = useState(server.autoStart)

  const toggleServer = useServerToggler()

  useEffect(() => {
    ;(async () => {
      setSoftList(await client.getServerSofts())
    })()
  }, [])

  return (
    <div>
      <ParagraphMedium>Server Name</ParagraphMedium>
      <Input size="compact" value={name} onChange={(e) => setName(e.currentTarget.value)} />

      <Sep />
      <ParagraphMedium>Type</ParagraphMedium>
      <RadioGroup value={type} onChange={(e) => setType(e.currentTarget.value as ServerType)} name="ServerType" align="horizontal">
        <Radio value="server">Server</Radio>
        <Radio value="bungee">Bungee</Radio>
        <Radio value="velocity">Velocity</Radio>
        <Radio value="other">Other</Radio>
      </RadioGroup>

      <Sep />
      <ParagraphMedium>Directory</ParagraphMedium>
      <Input size="compact" value={dir} onChange={(e) => setDir(e.currentTarget.value)} />

      <Sep />
      <ParagraphMedium>Soft</ParagraphMedium>
      <Select
        options={softList.map((soft) => ({ label: soft.name, id: soft.name, size: soft.size }))}
        value={[{ label: soft.name, id: soft.name, size: soft.size }]}
        placeholder="Select server software"
        onChange={(params) =>
          setSoft({
            name: params.value[0].id as string,
            size: params.value[0].size,
          })
        }
      />

      <Sep />
      <ParagraphMedium>Port</ParagraphMedium>
      <Input size="compact" type="number" value={port} onChange={(e) => setPort(parseInt(e.currentTarget.value))} />

      <Sep />
      <ParagraphMedium>Java</ParagraphMedium>
      <Input size="compact" value={java} onChange={(e) => setJava(e.currentTarget.value)} />

      <Sep />
      <ParagraphMedium>Max Memory</ParagraphMedium>
      <Input size="compact" type="number" value={maxMemory} onChange={(e) => setMaxMemory(parseInt(e.currentTarget.value))} />

      <Sep />
      <ParagraphMedium>Min Memory</ParagraphMedium>
      <Input size="compact" type="number" value={minMemory} onChange={(e) => setMinMemory(parseInt(e.currentTarget.value))} />

      <Sep />
      <ParagraphMedium>Custom JVM Args</ParagraphMedium>
      <Input size="compact" value={customJVMArgs} onChange={(e) => setCustomJVMArgs(e.currentTarget.value)} placeholder="-Dfile.encoding=UTF-8" />

      <Sep />
      <ParagraphMedium>Custom Server Args</ParagraphMedium>
      <Input size="compact" value={customServerArgs} onChange={(e) => setCustomServerArgs(e.currentTarget.value)} placeholder="--world myworld" />

      <Sep />
      <ParagraphMedium>Auto Start</ParagraphMedium>
      <Checkbox checked={autoStart} onChange={(e) => setAutoStart(e.currentTarget.checked)}>
        AutoStart
      </Checkbox>

      <Sep />
      <Button
        onClick={async () => {
          try {
            await server.updateConfig({
              name,
              type,
              dir,
              soft,
              port,
              java,
              maxMemory,
              minMemory,
              customJVMArgs,
              customServerArgs,
              autoStart,
            })
            notice.positive('Saved the server configuration.', {})
          } catch (error) {
            notice.negative(typeof error === 'string' ? error : 'An error has occurred.', {})
            console.error(error)
          }
        }}
      >
        Save
      </Button>
      <Button
        kind="secondary"
        onClick={async () => {
          try {
            if (!(await showConfirmation(`Delete server ${name}`, 'Are you sure you want to delete this? There is no undo'))) return
            await client.deleteServer(server.name)
            notice.positive('Deleted the server.', {})
            toggleServer()
          } catch (error) {
            notice.negative(typeof error === 'string' ? error : 'An error has occurred.', {})
          }
        }}
      >
        Delete
      </Button>
    </div>
  )
}
