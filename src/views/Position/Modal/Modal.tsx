import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import * as React from 'react'
import { styled } from '@mui/material'
import BoxWrapperColumn from 'src/components/Wrappers/BoxWrapperColumn'
import BoxWrapperRow from 'src/components/Wrappers/BoxWrapperRow'
import CustomTypography from 'src/components/CustomTypography'
import BoxContainerWrapper from 'src/components/Wrappers/BoxContainerWrapper'
import { SetupDetails } from './Create/SetupDetails'
import { TransactionDetails } from './Create/TransactionDetails'
import { TransactionCheck } from './Create/TransactionCheck'
import { Tenderly } from './Simulation/Tenderly'
import { Confirm } from './Confirm/Confirm'
import { Stepper } from './Stepper'
import { useApp } from 'src/contexts/app.context'
import { Strategy } from 'src/contexts/state'

interface ModalProps {
  open: boolean
  handleClose: () => void
}

const BoxWrapper = styled(Box)(() => ({
  backgroundColor: 'white',
  borderRadius: '8px'
}))

const BoxWrapperRowStyled = styled(BoxWrapperRow)(() => ({
  justifyContent: 'flex-start',
  borderBottom: '1px solid #B6B6B6'
}))

export const Modal = (props: ModalProps) => {
  const { open, handleClose } = props
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { dispatch, state } = useApp()

  const createValue: Maybe<Strategy> = state?.setup?.create?.value || null

  return (
    <Dialog
      fullScreen={true}
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
        backgroundColor: 'custom.grey.light'
      }}
    >
      <BoxContainerWrapper sx={{ maxHeight: '840px' }}>
        <BoxWrapperRow sx={{ padding: '20px', justifyContent: 'space-between' }}>
          <Box />
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </BoxWrapperRow>

        <BoxWrapperColumn sx={{ paddingRight: '10%', paddingLeft: '10%' }} gap={2}>
          <BoxWrapperRowStyled gap={2}>
            <CustomTypography variant="h6">Confirm exit strategy execution</CustomTypography>
          </BoxWrapperRowStyled>
          <BoxWrapperRow gap={2} sx={{ justifyContent: 'space-between', alignItems: 'self-start' }}>
            <BoxWrapperColumn
              sx={{ width: '60%', justifyContent: 'flex-start', height: '100%' }}
              gap={2}
            >
              <BoxWrapper>
                <BoxWrapperRowStyled gap={2}>
                  <CustomTypography variant="body2" sx={{ m: 3 }}>
                    {createValue?.description ?? 'Create'}
                  </CustomTypography>
                </BoxWrapperRowStyled>

                <SetupDetails />
                <TransactionDetails />
                <TransactionCheck />
                <Tenderly />
                <Confirm handleClose={handleClose} />
              </BoxWrapper>
            </BoxWrapperColumn>

            <BoxWrapperColumn sx={{ width: '40%', justifyContent: 'flex-start' }}>
              <Stepper />
            </BoxWrapperColumn>
          </BoxWrapperRow>
        </BoxWrapperColumn>
      </BoxContainerWrapper>
    </Dialog>
  )
}
