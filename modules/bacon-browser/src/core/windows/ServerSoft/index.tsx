import { ServerSoft } from 'bacon-types'
import { useStyletron } from 'baseui'
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
import { StyledHeadCell, StyledTable } from 'baseui/table-grid'
import React, { useEffect, useState } from 'react'

import { store } from '../../store'
import { Downloader } from './Downloader'
import { ServerSoftware } from './ServerSoft'

export const ServerSoftList: React.VFC = () => {
  const [css] = useStyletron()

  const [softList, setSoftList] = useState<ServerSoft[]>([])

  const updateSoftList = async () => {
    const softList = await store.client.getServerSofts()
    setSoftList(softList)
  }

  useEffect(() => {
    updateSoftList()
  }, [])
  return (
    <FlexGrid flexGridColumnCount={[1, 2, 2]} flexGridColumnGap="scale800" flexGridRowGap="scale800">
      <FlexGridItem>
        <div
          className={css({
            margin: '2rem',
          })}
        >
          <StyledTable role="grid" $gridTemplateColumns="1fr 0.25fr">
            <div role="row" className={css({ display: 'contents' })}>
              <StyledHeadCell>Name</StyledHeadCell>
              <StyledHeadCell>Size</StyledHeadCell>
            </div>
            {softList.map((soft, i) => {
              const striped = i % 2 === 0
              return <ServerSoftware key={i} soft={soft} striped={striped} onDelete={() => updateSoftList()} />
            })}
          </StyledTable>
        </div>
      </FlexGridItem>
      <FlexGridItem>
        <Downloader
          onDownloaded={() => {
            updateSoftList()
          }}
        />
      </FlexGridItem>
    </FlexGrid>
  )
}
