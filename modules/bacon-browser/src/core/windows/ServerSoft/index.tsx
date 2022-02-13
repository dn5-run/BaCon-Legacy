import { ServerSoft } from 'bacon-types'
import { useStyletron } from 'baseui'
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
import { StyledHeadCell, StyledTable } from 'baseui/table-grid'
import { Tabs, Tab } from 'baseui/tabs-motion'
import React, { Key, useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'

import { store } from '../../store'
import { Downloader } from './Downloader'
import { ServerSoftware } from './ServerSoft'
import { Uploader } from './Uploader'

export const ServerSoftList: React.VFC = () => {
  const [css] = useStyletron()

  const [softList, setSoftList] = useState<ServerSoft[]>([])
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

  const updateSoftList = async () => {
    const softList = await store.client.getServerSofts()
    setSoftList(softList)
  }

  useEffect(() => {
    updateSoftList()
  }, [])
  return isTabletOrMobile ? (
    <Mobile softList={softList} updateSoftList={updateSoftList} />
  ) : (
    <Desktop softList={softList} updateSoftList={updateSoftList} />
  )
}

const Mobile: React.VFC<{
  softList: ServerSoft[]
  updateSoftList: () => void
}> = ({ softList, updateSoftList }) => {
  const [activeKey, setActiveKey] = useState<Key>('0')
  return (
    <Tabs
      activeKey={activeKey}
      onChange={({ activeKey }) => {
        setActiveKey(activeKey)
      }}
      activateOnFocus
      overrides={{
        TabList: {
          style: ({ $theme }) => ({
            backgroundColor: $theme.colors.backgroundPrimary,
          }),
        },
      }}
    >
      <Tab title="List">
        <SoftList softList={softList} onDelete={updateSoftList} />
      </Tab>
      <Tab title="Download">
        <Downloader onDownloaded={updateSoftList} />
      </Tab>
      <Tab title="Upload">
        <Uploader
          onUploaded={(result) => {
            if (result) updateSoftList()
          }}
        />
      </Tab>
    </Tabs>
  )
}

const Desktop: React.VFC<{
  softList: ServerSoft[]
  updateSoftList: () => void
}> = ({ softList, updateSoftList }) => {
  return (
    <FlexGrid flexGridColumnCount={[1, 2, 2]} flexGridColumnGap="scale800" flexGridRowGap="scale800">
      <FlexGridItem>
        <SoftList softList={softList} onDelete={updateSoftList} />
      </FlexGridItem>
      <FlexGridItem>
        <Downloader onDownloaded={updateSoftList} />
        <Uploader
          onUploaded={(result) => {
            if (result) updateSoftList()
          }}
        />
      </FlexGridItem>
    </FlexGrid>
  )
}

const SoftList: React.VFC<{
  softList: ServerSoft[]
  onDelete: () => void
}> = ({ softList, onDelete }) => {
  const [css] = useStyletron()
  return (
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
          return <ServerSoftware key={i} soft={soft} striped={striped} onDelete={onDelete} />
        })}
      </StyledTable>
    </div>
  )
}
