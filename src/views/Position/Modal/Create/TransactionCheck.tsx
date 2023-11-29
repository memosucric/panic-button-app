import CustomTypography from 'src/components/CustomTypography'
import * as React from 'react'
import { AccordionBoxWrapper } from 'src/components/Accordion/AccordionBoxWrapper'
import {useApp} from "src/contexts/app.context";
import {SetupItemStatus} from "../../../../contexts/state";

export const TransactionCheck = () => {
  const {dispatch, state} = useApp()

  const transactionCheckValue = state?.setup?.transactionCheck?.value || null
  const transactionCheckStatus = state?.setup?.transactionCheck?.status || null

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
      { transactionCheckStatus === 'success' as SetupItemStatus && <CustomTypography variant={'body2'} sx={{ color: 'green' }}>Success</CustomTypography>}
      { transactionCheckValue === null && transactionCheckStatus === 'not done' as SetupItemStatus && <CustomTypography variant={'body2'} sx={{ color: 'black' }}>Pending</CustomTypography>}
      { transactionCheckStatus === 'failed' as SetupItemStatus && <CustomTypography variant={'body2'} sx={{ color: 'red' }}>Failed</CustomTypography>}
    </AccordionBoxWrapper>
  )
}
