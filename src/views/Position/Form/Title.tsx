import BoxWrapperColumn from 'src/components/Wrappers/BoxWrapperColumn'
import Primary from 'src/views/Position/Title/Primary'
import { Divider } from '@mui/material'
import * as React from 'react'

interface FormTitleProps {
  title: string
}

export const Title = ({ title }: FormTitleProps) => {
  return (
    <BoxWrapperColumn gap={1}>
      <Primary title={title} />
      <Divider sx={{ borderBottomWidth: 5 }} />
    </BoxWrapperColumn>
  )
}
