import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import * as React from 'react'
import { Accordion, AccordionSummary, styled } from '@mui/material'
import BoxWrapperColumn from 'src/components/Wrappers/BoxWrapperColumn'
import BoxWrapperRow from 'src/components/Wrappers/BoxWrapperRow'
import { Stepper } from './Modal/Stepper'
import CustomTypography from 'src/components/CustomTypography'
import BoxContainerWrapper from 'src/components/Wrappers/BoxContainerWrapper'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'

interface ModalProps {
  open: boolean
  handleClose: () => void
}

const BoxWrapper = styled(Box)(() => ({
  backgroundColor: 'white',
  borderRadius: '8px'
}))

const AccordionWrapper = styled(Accordion)(() => ({
  boxShadow: 'none'
}))

const AccordionBoxWrapper = styled(BoxWrapperRow)(() => ({
  backgroundColor: '#eeeded',
  minHeight: '48px',
  borderBottomLeftRadius: '4px',
  borderBottomRightRadius: '4px',
  borderTopLeftRadius: '4px',
  borderTopRightRadius: '4px',
  padding: '0px 16px'
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
            <CustomTypography variant="h6">Confirm transaction</CustomTypography>
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
                <BoxWrapperRow gap={2} sx={{ m: 3, backgroundColor: 'custom.grey.light' }}>
                  <AccordionWrapper>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <CustomTypography variant={'body2'}>Setup details</CustomTypography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <CustomTypography variant={'body2'}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                        malesuada lacus ex, sit amet blandit leo lobortis eget.
                      </CustomTypography>
                    </AccordionDetails>
                  </AccordionWrapper>
                </BoxWrapperRow>
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
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                        malesuada lacus ex, sit amet blandit leo lobortis eget.
                      </CustomTypography>
                    </AccordionDetails>
                  </AccordionWrapper>
                </BoxWrapperRow>
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
                <AccordionBoxWrapper
                  gap={2}
                  sx={{
                    m: 3,
                    backgroundColor: 'background.default',
                    justifyContent: 'space-between'
                  }}
                >
                  <CustomTypography variant={'body2'}>Tenderly</CustomTypography>
                  <Button variant="contained" size="small">
                    Simulate
                  </Button>
                </AccordionBoxWrapper>
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
