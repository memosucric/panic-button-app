import CustomTypography from 'src/components/CustomTypography'
import * as React from 'react'
import { AccordionBoxWrapper } from 'src/components/Accordion/AccordionBoxWrapper'
import {useApp} from "src/contexts/app.context";
import {SetupItemStatus} from "../../../../contexts/state";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import BoxWrapperRow from "../../../../components/Wrappers/BoxWrapperRow";

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
      <BoxWrapperRow gap={1}>
        <CustomTypography variant={'body2'}>Transaction check</CustomTypography>
        <Tooltip
          title={
            <CustomTypography variant="body2" sx={{ color: 'common.white' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </CustomTypography>
          }
          sx={{ ml: 1, cursor: 'pointer' }}
        >
          <InfoIcon sx={{ fontSize: 24, cursor: 'pointer' }} />
        </Tooltip>
      </BoxWrapperRow>
      { transactionCheckStatus === 'success' as SetupItemStatus && <CustomTypography variant={'body2'} sx={{ color: 'green' }}>Success</CustomTypography>}
      { transactionCheckValue === null && transactionCheckStatus === 'not done' as SetupItemStatus && <CustomTypography variant={'body2'} sx={{ color: 'black' }}>Pending</CustomTypography>}
      { transactionCheckStatus === 'failed' as SetupItemStatus && <CustomTypography variant={'body2'} sx={{ color: 'red' }}>Failed</CustomTypography>}
    </AccordionBoxWrapper>
  )
}
