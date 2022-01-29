import { ServerStatus } from 'bacon-types'
import { styled } from 'baseui'
import { useStyletron } from 'baseui'
import { Card } from 'baseui/card'
import { Table } from 'baseui/table-semantic'
import React, { createRef, useEffect, useState } from 'react'

import { ServerProps } from '../..'
import { Accordion, AccordionHeader, AccordionBody } from '../../../../components/Accordion'
import { Header } from './Header'

const StyledCard = styled(Card, {
  overflow: 'hidden',
  transition: 'all 0.3s ease-out',
})

export const ServerCard: React.VFC<ServerProps> = ({ server }) => {
  const header = createRef<HTMLDivElement>()
  const wrapper = createRef<HTMLDivElement>()

  const [css] = useStyletron()
  const [maxHeight, setMaxHeight] = useState('58px')

  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    if (wrapper.current && header.current) setMaxHeight(`${isOpen ? wrapper.current.scrollHeight : header.current.scrollHeight}px`)
  }, [isOpen])

  const [status, setStatus] = useState<ServerStatus>({ status: false })
  useEffect(() => {
    ;(async () => {
      const data = await server.getStatus()
      if (data.status) {
        data.cpuUsage = Math.round(data.cpuUsage * 10) / 10
        data.memoryUsage = Math.round((data.memoryUsage / 1024 / 1024) * 10) / 10
      }
      setStatus(data)
    })()
  }, [])

  return (
    <StyledCard>
      <div
        ref={wrapper}
        className={css({
          maxHeight,
          transition: 'all 0.3s ease-out',
        })}
      >
        <Header refObj={header} status={status} server={server} isOpen={isOpen} setIsOpen={setIsOpen} />
        <div
          className={css({
            marginTop: '25px',
          })}
        >
          <Table
            columns={['', '']}
            size="compact"
            data={[
              ['status', status.status ? 'online' : 'offline'],
              ['Server type', server.type],
              ['Server port', server.port],
            ]}
            overrides={{
              TableHeadCell: {
                style: {
                  display: 'none',
                },
              },
            }}
          />
        </div>
      </div>

      <Accordion isOpen={false}>
        <AccordionHeader></AccordionHeader>
        <AccordionBody></AccordionBody>
      </Accordion>
    </StyledCard>
  )
}
