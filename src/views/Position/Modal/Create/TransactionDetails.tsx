import BoxWrapperRow from 'src/components/Wrappers/BoxWrapperRow'
import { AccordionSummary } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CustomTypography from 'src/components/CustomTypography'
import AccordionDetails from '@mui/material/AccordionDetails'
import * as React from 'react'
import { AccordionWrapper } from 'src/components/Accordion/AccordionWrapper'

export const TransactionDetails = () => {
  return (
    <BoxWrapperRow gap={2} sx={{ m: 3, backgroundColor: 'custom.grey.light' }}>
      <AccordionWrapper>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <CustomTypography variant={'body2'}>Transaction details</CustomTypography>
        </AccordionSummary>
        <AccordionDetails>
          <CustomTypography variant={'body2'}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </CustomTypography>
        </AccordionDetails>
      </AccordionWrapper>
    </BoxWrapperRow>
  )
}
