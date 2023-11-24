import * as React from 'react'
import Box from '@mui/material/Box'
import StepperMUI from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Paper from '@mui/material/Paper'
import CustomTypography from 'src/components/CustomTypography'
import BoxWrapperRow from 'src/components/Wrappers/BoxWrapperRow'

const steps = [
  {
    label: 'Create'
  },
  {
    label: 'Simulation'
  },
  {
    label: 'Confirm'
  }
]

export const Stepper = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeStep, setActiveStep] = React.useState(0)

  return (
    <Box sx={{ backgroundColor: 'white', borderRadius: '8px' }}>
      <BoxWrapperRow
        sx={{ justifyContent: 'flex-start', borderBottom: '1px solid #B6B6B6' }}
        gap={2}
      >
        <CustomTypography
          variant="body2"
          sx={{
            m: 3,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            width: '90%'
          }}
        >
          Transaction status
        </CustomTypography>
      </BoxWrapperRow>
      <StepperMUI activeStep={activeStep} orientation="vertical" sx={{ m: 3 }}>
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>
              <CustomTypography
                variant="body2"
                sx={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  width: '90%'
                }}
              >
                {step.label}
              </CustomTypography>
            </StepLabel>
          </Step>
        ))}
      </StepperMUI>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <CustomTypography variant={'h6'} sx={{ m: 3 }}>
            All steps completed - you&apos;re finished
          </CustomTypography>
        </Paper>
      )}
    </Box>
  )
}
