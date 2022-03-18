import { useConfirmation } from '@/components/confirmation'
import { PluginType } from 'bacon-types'
import { useStyletron, withStyle } from 'baseui'
import { Button } from 'baseui/button'
import { ChevronDown, ChevronRight } from 'baseui/icon'
import { StyledLink } from 'baseui/link'
import { StyledSpinnerNext } from 'baseui/spinner'
import { StyledTable, StyledHeadCell, StyledBodyCell } from 'baseui/table-grid'
import { HeadingLarge } from 'baseui/typography'
import { useState } from 'react'
import { VscTrash } from 'react-icons/vsc'

import { useServer } from '../..'

const CenteredBodyCell = withStyle(StyledBodyCell, {
  display: 'flex',
  alignItems: 'center',
})
const Plugin: React.VFC<{
  plugin: PluginType
  striped: boolean
  onDelete?: () => void | Promise<void>
}> = ({ plugin, striped, onDelete }) => {
  const [server] = useServer()
  const showConfirmation = useConfirmation()
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

export const PluginList: React.VFC<{
  plugins: PluginType[]
  onDelete?: () => void
}> = ({ plugins, onDelete }) => {
  const [server] = useServer()

  const [css] = useStyletron()

  return (
    <div
      className={css({
        width: '70%',
      })}
    >
      {plugins ? (
        <StyledTable role="grid" $gridTemplateColumns="1fr 0.25fr">
          <div role="row" className={css({ display: 'contents' })}>
            <StyledHeadCell>Name</StyledHeadCell>
            <StyledHeadCell>Size</StyledHeadCell>
          </div>
          {plugins.map((plugin, i) => {
            const striped = i % 2 === 0
            return <Plugin key={i} plugin={plugin} striped={striped} onDelete={onDelete} />
          })}
        </StyledTable>
      ) : (
        <div
          className={css({
            height: '75vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          })}
        >
          <HeadingLarge>Loading...</HeadingLarge>
          <StyledSpinnerNext />
        </div>
      )}
    </div>
  )
}
