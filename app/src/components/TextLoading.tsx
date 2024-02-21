import CustomTypography from 'src/components/CustomTypography'
import * as React from 'react'
import Box from '@mui/material/Box'
import { HEADER_HEIGHT } from 'src/components/Layout/Header'
import { FOOTER_HEIGHT } from 'src/components/Layout/Footer'

const TextLoading = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: `calc(100vh - ${HEADER_HEIGHT}px - ${FOOTER_HEIGHT}px)`
    }}
  >
    <CustomTypography
      color="textSecondary"
      variant="body1"
      justifyContent="center"
      minHeight="75%"
      alignItems="center"
      display="flex"
    >
      Loading...
    </CustomTypography>
  </Box>
)

export default TextLoading
