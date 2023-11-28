import CustomTypography from 'src/components/CustomTypography'
import * as React from 'react'
import { AccordionBoxWrapper } from 'src/components/Accordion/AccordionBoxWrapper'
import {useApp} from "src/contexts/app.context";

export const TransactionCheck = () => {
  const {dispatch, state} = useApp()

  const {strategy} = state
  const {transactionCheck, status} = strategy

  console.log('transactionCheck', transactionCheck)

  return (
    <AccordionBoxWrapper
      gap={2}
      sx={{
        m: 3,
        backgroundColor: 'background.default',
        justifyContent: 'space-between'
      }}
    >
      <CustomTypography variant={'body2'}>Transaction check</CustomTypography>
      { transactionCheck === true && <CustomTypography variant={'body2'} sx={{ color: 'green' }}>Success</CustomTypography>}
      { transactionCheck === null && <CustomTypography variant={'body2'} sx={{ color: 'black' }}>Pending</CustomTypography>}
      { transactionCheck === false && <CustomTypography variant={'body2'} sx={{ color: 'red' }}>Failed</CustomTypography>}
    </AccordionBoxWrapper>
  )
}
