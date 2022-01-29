import { ServerSoft } from 'bacon-types'
import { useStyletron, withStyle } from 'baseui'
import { Button } from 'baseui/button'
import { StyledBodyCell } from 'baseui/table-grid'
import React from 'react'
import { VscTrash } from 'react-icons/vsc'

import { showConfirmation } from '../../components/Confirmation'
import { store } from '../../store'

const CenteredBodyCell = withStyle(StyledBodyCell, {
  display: 'flex',
  alignItems: 'center',
})
export const ServerSoftware: React.VFC<{
  soft: ServerSoft
  striped: boolean
  onDelete?: () => void | Promise<void>
}> = ({ soft, onDelete }) => {
  const [css] = useStyletron()
  return (
    <div role="row" className={css({ display: 'contents' })}>
      <CenteredBodyCell>
        <Button
          size="compact"
          kind="minimal"
          onClick={async () => {
            if (!(await showConfirmation(`Delete server software ${soft.name}`, 'Are you sure you want to delete this? There is no undo'))) return
            await store.client.deleteServerSoft(soft.name)
            onDelete && onDelete()
          }}
          shape="square"
        >
          <VscTrash />
        </Button>
        {soft.name}
      </CenteredBodyCell>
      <CenteredBodyCell>{Math.round((soft.size / 1024 / 1024) * 10) / 10} MB</CenteredBodyCell>
    </div>
  )
}
