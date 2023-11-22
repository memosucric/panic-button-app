import CustomTypography from 'src/components/CustomTypography'
import Button from '@mui/material/Button'
import * as React from 'react'
import { AccordionBoxWrapper } from 'src/components/Accordion/AccordionBoxWrapper'

export const Confirm = () => {
  return (
    <AccordionBoxWrapper
      gap={2}
      sx={{
        m: 3,
        backgroundColor: 'background.default',
        justifyContent: 'space-between'
      }}
    >
      <CustomTypography variant={'body2'}>
        Would you like to confirm this transaction?
      </CustomTypography>
      <Button variant="contained" size="small">
        Execute
      </Button>
    </AccordionBoxWrapper>
  )
}
