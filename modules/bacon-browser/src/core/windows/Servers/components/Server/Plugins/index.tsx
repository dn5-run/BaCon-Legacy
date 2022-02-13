import { PluginType } from 'bacon-types'
import { useStyletron, withStyle } from 'baseui'
import { Button } from 'baseui/button'
import { ChevronDown, ChevronRight } from 'baseui/icon'
import { StyledLink } from 'baseui/link'
import { StyledSpinnerNext } from 'baseui/spinner'
import { StyledTable, StyledHeadCell, StyledBodyCell } from 'baseui/table-grid'
import { HeadingLarge, ParagraphSmall } from 'baseui/typography'
import React, { useEffect, useState } from 'react'
import { VscTrash } from 'react-icons/vsc'

import { ServerProps } from '../../..'
import { showConfirmation } from '../../../../../components/Confirmation'
import { Serverw } from '../../../ClientWrapper'

const CenteredBodyCell = withStyle(StyledBodyCell, {
  display: 'flex',
  alignItems: 'center',
})
const Plugin: React.VFC<{
  server: Serverw
  plugin: PluginType
  striped: boolean
  onDelete?: () => void | Promise<void>
}> = ({ server, plugin, striped, onDelete }) => {
  const [css] = useStyletron()
  const [expanded, setExpanded] = useState(false)
  return (
    <div role="row" className={css({ display: 'contents', maxWidth: '100%' })}>
      <CenteredBodyCell $striped={striped}>
        <Button
          size="compact"
          kind="minimal"
          onClick={async () => {
            if (!(await showConfirmation(`Delete plugin ${plugin.fileName}`, 'Are you sure you want to delete this? There is no undo'))) return
            await server.deletePlugin(plugin.fileName)
            onDelete && onDelete()
          }}
          shape="square"
        >
          <VscTrash />
        </Button>
        <Button size="compact" kind="minimal" onClick={() => setExpanded(!expanded)} shape="square">
          {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </Button>
        <>{plugin.fileName}</>
      </CenteredBodyCell>
      <CenteredBodyCell $striped={striped}>{Math.round((plugin.fileSize / 1024 / 1024) * 10) / 10} MB</CenteredBodyCell>
      {expanded && plugin.meta && (
        <div className={css({ gridColumn: 'span 2', padding: '32px 24px' })}>
          <StyledTable $gridTemplateColumns="1fr 1fr 1fr 1fr 1fr">
            <div role="row" className={css({ display: 'contents' })}>
              <StyledHeadCell>Name</StyledHeadCell>
              <StyledHeadCell>Description</StyledHeadCell>
              <StyledHeadCell>Version</StyledHeadCell>
              <StyledHeadCell>Author</StyledHeadCell>
              <StyledHeadCell>Website</StyledHeadCell>
            </div>
            <div role="row" className={css({ display: 'contents' })}>
              <StyledBodyCell>{plugin.meta.name}</StyledBodyCell>
              <StyledBodyCell>{plugin.meta.description}</StyledBodyCell>
              <StyledBodyCell>{plugin.meta.version}</StyledBodyCell>
              <StyledBodyCell>{plugin.meta.author ?? plugin.meta.authors?.join(', ')}</StyledBodyCell>
              <StyledBodyCell>
                <StyledLink href={plugin.meta.website} target="_blank">
                  {plugin.meta.website}
                </StyledLink>
              </StyledBodyCell>
            </div>
          </StyledTable>
        </div>
      )}
    </div>
  )
}

export const Plugins: React.VFC<ServerProps> = ({ server }) => {
  const [css] = useStyletron()
  const [plugins, setPlugins] = useState<PluginType[] | null>(null)

  const updatePlugins = async () => {
    try {
      const plugins = await server.getPlugins()
      setPlugins(plugins)
    } catch (error) {
      setPlugins([])
    }
  }

  useEffect(() => {
    updatePlugins()
  }, [])

  return (
    <div>
      {plugins ? (
        <StyledTable role="grid" $gridTemplateColumns="1fr 0.25fr">
          <div role="row" className={css({ display: 'contents' })}>
            <StyledHeadCell>Name</StyledHeadCell>
            <StyledHeadCell>Size</StyledHeadCell>
          </div>
          {plugins.map((plugin, i) => {
            const striped = i % 2 === 0
            return <Plugin key={i} server={server} plugin={plugin} striped={striped} onDelete={updatePlugins} />
          })}
        </StyledTable>
      ) : (
        <>
          <HeadingLarge>
            Loading... <StyledSpinnerNext />
          </HeadingLarge>
        </>
      )}
    </div>
  )
}
