import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import * as React from 'react'
import { styled } from '@mui/material'
import BoxWrapperColumn from 'src/components/Wrappers/BoxWrapperColumn'
import BoxWrapperRow from 'src/components/Wrappers/BoxWrapperRow'
import { Stepper } from './Stepper'
import CustomTypography from 'src/components/CustomTypography'
import BoxContainerWrapper from 'src/components/Wrappers/BoxContainerWrapper'
import { SetupDetails } from './Create/SetupDetails'
import { TransactionDetails } from './Create/TransactionDetails'
import { Manual } from './Simulation/Manual'
import { Tenderly } from './Simulation/Tenderly'
import { Confirm } from './Confirm/Confirm'

interface ModalProps {
  open: boolean
  handleClose: () => void
}

const BoxWrapper = styled(Box)(() => ({
  backgroundColor: 'white',
  borderRadius: '8px'
}))

export const Modal = (props: ModalProps) => {
  const { open, handleClose } = props

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
          <BoxWrapperRow
            sx={{ justifyContent: 'flex-start', borderBottom: '1px solid #B6B6B6' }}
            gap={2}
          >
            <CustomTypography variant="h6">Confirm exit strategy execution</CustomTypography>
          </BoxWrapperRow>
          <BoxWrapperRow gap={2} sx={{ justifyContent: 'space-between', alignItems: 'self-start' }}>
            <BoxWrapperColumn
              sx={{ width: '60%', justifyContent: 'flex-start', height: '100%' }}
              gap={2}
            >
              <BoxWrapper>
                <BoxWrapperRow
                  sx={{ justifyContent: 'flex-start', borderBottom: '1px solid #B6B6B6' }}
                  gap={2}
                >
                  <CustomTypography variant="body2" sx={{ m: 3 }}>
                    Create
                  </CustomTypography>
                </BoxWrapperRow>

                <SetupDetails />
                <TransactionDetails />
              </BoxWrapper>
              <BoxWrapper>
                <BoxWrapperRow
                  sx={{ justifyContent: 'flex-start', borderBottom: '1px solid #B6B6B6' }}
                  gap={2}
                >
                  <CustomTypography variant="body2" sx={{ m: 3 }}>
                    Simulation
                  </CustomTypography>
                </BoxWrapperRow>

                <Manual />
                <Tenderly />
              </BoxWrapper>

              <BoxWrapper>
                <BoxWrapperRow
                  sx={{ justifyContent: 'flex-start', borderBottom: '1px solid #B6B6B6' }}
                  gap={2}
                >
                  <CustomTypography variant="body2" sx={{ m: 3 }}>
                    Confirm
                  </CustomTypography>
                </BoxWrapperRow>

                <Confirm />
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
