import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
import React from 'react'
import { styled } from 'styletron-react'

import { ServerProps } from '../../..'
import { ChartCard } from './Card/Chart'
import { Status } from './Card/Status'

const StyledFlexGrid = styled(FlexGrid, {
  marginTop: '10px',
})

export const Summary: React.VFC<ServerProps> = ({ server }) => {
  return (
    <>
      <StyledFlexGrid flexGridColumnCount={3} flexGridColumnGap="scale800" flexGridRowGap="scale800">
        <FlexGridItem>
          <Status server={server} />
        </FlexGridItem>
      </StyledFlexGrid>

      <StyledFlexGrid flexGridColumnCount={3} flexGridColumnGap="scale800" flexGridRowGap="scale800">
        <FlexGridItem>
          <ChartCard />
        </FlexGridItem>
      </StyledFlexGrid>
    </>
  )
}
