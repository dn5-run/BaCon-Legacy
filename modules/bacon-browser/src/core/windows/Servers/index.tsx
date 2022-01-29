import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
import React, { useEffect, useState } from 'react'
import { styled } from 'styletron-react'

import { store } from '../../store'
import { Serverw } from './ClientWrapper'
import { CreateServer } from './components/CreateServer'
import { ServerFC } from './components/Server'
import { ServerCard } from './components/ServerCard'

const StyledFlexGrid = styled(FlexGrid, {
  margin: '20px',
  overflowY: 'auto',
})

export interface ServerProps {
  server: Serverw
}

export const Servers: React.VFC = () => {
  const [servers, setServers] = useState<Serverw[]>([])
  const [currentServer, setCurrentServer] = useState<Serverw | undefined>()

  useEffect(() => {
    ;(async () => {
      const servers = await store.client.getServers()
      setServers(Serverw.fromArray(servers, store.client))
    })()
  }, [currentServer])

  toggler = (name?: string) => {
    setCurrentServer(name ? servers.find((s) => s.name === name) : undefined)
  }

  return currentServer ? (
    <ServerFC server={currentServer} />
  ) : (
    <StyledFlexGrid flexGridColumnCount={[1, 1, 3]} flexGridColumnGap="scale800" flexGridRowGap="scale800">
      {servers.map((server, index) => (
        <FlexGridItem width={'calc(100% / 3)'} key={index}>
          <ServerCard server={server} />
        </FlexGridItem>
      ))}
      <FlexGridItem width={'calc(100% / 3)'} key="create new server">
        <CreateServer
          onCreate={async () => {
            const servers = await store.client.getServers()
            setServers(Serverw.fromArray(servers, store.client))
          }}
        />
      </FlexGridItem>
    </StyledFlexGrid>
  )
}
let toggler: (name?: string) => void
export const toggleServer = (name?: string) => toggler(name)
