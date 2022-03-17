import { MinecraftServerType, ServerSoft, ServerType } from 'bacon-types'
import { styled, useStyletron } from 'baseui'
import { Button } from 'baseui/button'
import { Card } from 'baseui/card'
import { Checkbox } from 'baseui/checkbox'
import { Input } from 'baseui/input'
import { RadioGroup, Radio } from 'baseui/radio'
import { Select } from 'baseui/select'
import { HeadingMedium, ParagraphMedium } from 'baseui/typography'
import { useEffect, useState } from 'react'
import { VscAdd, VscRemove } from 'react-icons/vsc'

import { useBaCon } from '../../../../../BaCon/BaConProvider'
import { Accordion, AccordionBody, AccordionHeader } from '../../../../components/Accordion'
import { useNotification } from '../../../../components/Notification'

const StyledCard = styled(Card, {
  overflow: 'hidden',
  transition: 'all 0.3s ease-out',
})

const Sep = styled('div', {
  width: '100%',
  height: '1rem',
})

export const CreateServer: React.VFC<{ onCreate?: () => void }> = ({ onCreate }) => {
  const client = useBaCon()
  const notice = useNotification()

  const [css] = useStyletron()
  const [isOpen, setIsOpen] = useState(false)

  const initialConfig: MinecraftServerType = {
    name: '',
    type: 'server',
    dir: '',
    soft: { name: '', size: 0 },
    port: 25565,
    java: '',
    maxMemory: 4092,
    minMemory: 2048,
    customJVMArgs: '',
    customServerArgs: '',
    autoStart: false,
  }

  const [config, setConfig] = useState<MinecraftServerType>(initialConfig)
  const [softList, setSoftList] = useState<ServerSoft[]>([])

  useEffect(() => {
    ;(async () => {
      setSoftList(await client.getServerSofts())
    })()
  }, [])

  return (
    <StyledCard>
      <Accordion isOpen={isOpen}>
        <AccordionHeader>
          <div
            className={css({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            })}
          >
            <HeadingMedium>Create Server</HeadingMedium>
            <Button size="mini" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <VscRemove /> : <VscAdd />}
            </Button>
          </div>
        </AccordionHeader>
        <AccordionBody>
          <div>
            <ParagraphMedium>Server Name</ParagraphMedium>
            <Input size="compact" value={config.name} onChange={(e) => setConfig({ ...config, name: e.currentTarget.value })} />

            <Sep />
            <ParagraphMedium>Type</ParagraphMedium>
            <RadioGroup
              value={config.type}
              onChange={(e) => setConfig({ ...config, type: e.currentTarget.value as ServerType })}
              name="ServerType"
              align="horizontal"
            >
              <Radio value="server">Server</Radio>
              <Radio value="bungee">Bungee</Radio>
              <Radio value="velocity">Velocity</Radio>
              <Radio value="other">Other</Radio>
            </RadioGroup>

            <Sep />
            <ParagraphMedium>Directory</ParagraphMedium>
            <Input size="compact" value={config.dir} onChange={(e) => setConfig({ ...config, dir: e.currentTarget.value })} />

            <Sep />
            <ParagraphMedium>Soft</ParagraphMedium>
            <Select
              options={softList.map((soft) => ({ label: soft.name, id: soft.name, size: soft.size }))}
              value={[{ label: config.soft.name, id: config.soft.name, size: config.soft.size }]}
              placeholder="Select server software"
              onChange={(params) => {
                setConfig({
                  ...config,
                  soft: {
                    name: params.value[0].id as string,
                    size: params.value[0].size as number,
                  },
                })
              }}
            />

            <Sep />
            <ParagraphMedium>Port</ParagraphMedium>
            <Input
              size="compact"
              type="number"
              value={config.port}
              onChange={(e) => setConfig({ ...config, port: parseInt(e.currentTarget.value) })}
            />

            <Sep />
            <ParagraphMedium>Java</ParagraphMedium>
            <Input size="compact" value={config.java} onChange={(e) => setConfig({ ...config, java: e.currentTarget.value })} />

            <Sep />
            <ParagraphMedium>Max Memory</ParagraphMedium>
            <Input
              size="compact"
              type="number"
              value={config.maxMemory}
              onChange={(e) => setConfig({ ...config, maxMemory: parseInt(e.currentTarget.value) })}
            />

            <Sep />
            <ParagraphMedium>Min Memory</ParagraphMedium>
            <Input
              size="compact"
              type="number"
              value={config.minMemory}
              onChange={(e) => setConfig({ ...config, minMemory: parseInt(e.currentTarget.value) })}
            />

            <Sep />
            <ParagraphMedium>Custom JVM Args</ParagraphMedium>
            <Input
              size="compact"
              value={config.customJVMArgs}
              onChange={(e) => setConfig({ ...config, customJVMArgs: e.currentTarget.value })}
              placeholder="-Dfile.encoding=UTF-8"
            />

            <Sep />
            <ParagraphMedium>Custom Server Args</ParagraphMedium>
            <Input
              size="compact"
              value={config.customServerArgs}
              onChange={(e) => setConfig({ ...config, customServerArgs: e.currentTarget.value })}
              placeholder="--world myworld"
            />

            <Sep />
            <ParagraphMedium>Auto Start</ParagraphMedium>
            <Checkbox checked={config.autoStart} onChange={(e) => setConfig({ ...config, autoStart: e.currentTarget.checked })}>
              AutoStart
            </Checkbox>

            <Sep />
            <Button
              onClick={async () => {
                try {
                  await client.createServer(config)
                  notice.positive('Server created', {})
                  if (onCreate) onCreate()
                  setIsOpen(false)
                  setConfig(initialConfig)
                } catch (error) {
                  notice.negative(typeof error === 'string' ? error : 'An error has occurred.', {})
                  console.error(error)
                }
              }}
            >
              Create
            </Button>
          </div>
        </AccordionBody>
      </Accordion>
    </StyledCard>
  )
}
