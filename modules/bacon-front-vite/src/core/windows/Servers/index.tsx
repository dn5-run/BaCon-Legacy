import { Server } from 'bacon-client'
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
import { createContext, useContext, useEffect, useState } from 'react'
import { styled } from 'styletron-react'

import { useBaCon } from '../../../BaCon/BaConProvider'
import { CreateServer } from './components/CreateServer'
import { ServerFC } from './components/Server'
import { ServerCard } from './components/ServerCard'

const StyledFlexGrid = styled(FlexGrid, {
  margin: '20px',
  overflowY: 'auto',
})

const ToggleServerContext = createContext((name?: string) => {})
export const useServerToggler = () => {
  return useContext(ToggleServerContext)
}

export const Servers: React.VFC = () => {
  const client = useBaCon()
  const [servers, setServers] = useState<Server[]>([])
  const [currentServer, setCurrentServer] = useState<string | undefined>()

  const updateServers = async () => setServers(await client.getServers())
  useEffect(() => {
    updateServers()
  }, [currentServer])

  const server = servers.find((s) => s.name === currentServer)

  return (
    <ToggleServerContext.Provider value={setCurrentServer}>
      {server ? (
        <ServerFC server={server} />
      ) : (
        <StyledFlexGrid flexGridColumnCount={[1, 1, 2, 3]} flexGridColumnGap="scale800" flexGridRowGap="scale800">
          {servers.map((s, index) => (
            <FlexGridItem width={'calc(100% / 3)'} key={index}>
              <ServerCard server={s} />
            </FlexGridItem>
          ))}
          <FlexGridItem width={'calc(100% / 3)'} key="create new server">
            <CreateServer onCreate={updateServers} />
          </FlexGridItem>
        </StyledFlexGrid>
      )}
    </ToggleServerContext.Provider>
  )
}
