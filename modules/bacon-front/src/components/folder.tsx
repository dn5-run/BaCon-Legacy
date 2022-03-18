import { FileStat } from 'bacon-types'
import { useStyletron, withStyle } from 'baseui'
import { Button } from 'baseui/button'
import { ChevronDown, ChevronRight } from 'baseui/icon'
import { StyledBodyCell, StyledHeadCell, StyledTable } from 'baseui/table-grid'
import { useState } from 'react'
import { VscFile, VscFolder, VscFolderOpened } from 'react-icons/vsc'

const CenteredBodyCell = withStyle(StyledBodyCell, {
  display: 'flex',
  alignItems: 'center',
  padding: '0 5px',
})

type Props = FileStat & {
  onSelect?: (file: FileStat) => void
}

const File: React.VFC<Props> = (props) => {
  const [css] = useStyletron()
  return (
    <div role="row" className={css({ display: 'contents' })}>
      <CenteredBodyCell>
        <Button
          size="compact"
          kind="minimal"
          onClick={() => {
            const { onSelect, ...file } = props
            onSelect && onSelect(file)
          }}
          shape="square"
        >
          <VscFile size={18} />
        </Button>
        {props.name}
      </CenteredBodyCell>
    </div>
  )
}

const FolderInner: React.VFC<Props> = (props) => {
  const [css] = useStyletron()
  const [expanded, setExpanded] = useState(false)
  return (
    <div role="row" className={css({ display: 'contents' })}>
      <CenteredBodyCell>
        <Button size="compact" kind="minimal" onClick={() => setExpanded(!expanded)} shape="square">
          {expanded ? <VscFolderOpened size={18} /> : <VscFolder size={18} />}
        </Button>
        {props.name}
      </CenteredBodyCell>
      {expanded && <Folder {...props} />}
    </div>
  )
}

export const Folder: React.VFC<Props> = (props) => {
  const [css] = useStyletron()
  if (!props.children) throw new Error('Folder must have children')
  props.children.sort((a, b) => {
    if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    return 0
  })
  return !props.children || props.children.length === 0 ? (
    <></>
  ) : (
    <div className={css({ gridColumn: 'span 1', padding: '10px 10px' })}>
      <StyledTable role="grid" $gridTemplateColumns="1fr">
        {props.children &&
          props.children.map((child) => {
            if (child.isDirectory) {
              return <FolderInner key={child.name} {...child} onSelect={props.onSelect} />
            } else {
              return <File key={child.name} {...child} onSelect={props.onSelect} />
            }
          })}
      </StyledTable>
    </div>
  )
}
