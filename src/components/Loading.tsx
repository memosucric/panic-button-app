import { HEADER_HEIGHT } from 'src/components/Layout/Header'
import { FOOTER_HEIGHT } from 'src/components/Layout/Footer'
import CircularProgress from '@mui/material/CircularProgress'
import * as React from 'react'
import BoxWrapperColumn from 'src/components/Wrappers/BoxWrapperColumn'

const Loading = () => {
  return (
    <BoxWrapperColumn
      sx={{
        minHeight: `calc(100vh - ${HEADER_HEIGHT}px - ${FOOTER_HEIGHT}px)`,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <CircularProgress color="primary" />
    </BoxWrapperColumn>
  )
}

export default Loading
