import CustomTypography from 'src/components/CustomTypography'
import * as React from 'react'
import { AccordionBoxWrapper } from 'src/components/Accordion/AccordionBoxWrapper'

export const Manual = () => {
  return (
    <AccordionBoxWrapper
      gap={2}
      sx={{
        m: 3,
        backgroundColor: 'background.default',
        justifyContent: 'space-between'
      }}
    >
      <CustomTypography variant={'body2'}>Manual</CustomTypography>
      <CustomTypography variant={'body2'} sx={{ color: 'green' }}>
        Success
      </CustomTypography>
    </AccordionBoxWrapper>
  )
}
