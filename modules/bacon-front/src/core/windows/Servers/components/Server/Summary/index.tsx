import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
import React from 'react'
import { styled } from 'styletron-react'

import { useServer } from '..'
import { Status } from './Card/Status'

const StyledFlexGrid = styled(FlexGrid, {
  marginTop: '10px',
})

export const Summary: React.VFC = () => {
  const [server] = useServer()
  return (
    <>
      <StyledFlexGrid flexGridColumnCount={3} flexGridColumnGap="scale800" flexGridRowGap="scale800">
        <FlexGridItem>
          <Status />
        </FlexGridItem>
      </StyledFlexGrid>

      {/* <StyledFlexGrid flexGridColumnCount={3} flexGridColumnGap="scale800" flexGridRowGap="scale800">
        <FlexGridItem>
          <ChartCard />
        </FlexGridItem>
      </StyledFlexGrid> */}
    </>
  )
}
