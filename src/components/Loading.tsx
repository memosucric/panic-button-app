import CircularProgress from '@mui/material/CircularProgress'
import * as React from 'react'
import BoxWrapperColumn from 'src/components/Wrappers/BoxWrapperColumn'

interface LoadingProps {
  minHeight?: string
}

const Loading = (props: LoadingProps) => {
  return (
    <BoxWrapperColumn
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: props?.minHeight
      }}
    >
      <CircularProgress color="primary" />
    </BoxWrapperColumn>
  )
}

export default Loading
