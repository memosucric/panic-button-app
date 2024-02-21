import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import * as React from 'react'

const AnimatedLoading = () => (
  <Box
    display="flex"
    justifyContent="center"
    flexDirection="column"
    alignItems="center"
    sx={{ minHeight: 'calc(100vh - 160px)' }}
  >
    <CircularProgress color="primary" />
  </Box>
)

export default AnimatedLoading
