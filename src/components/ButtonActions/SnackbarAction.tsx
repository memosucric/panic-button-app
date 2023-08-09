import CustomTypography from 'src/components/CustomTypography'
import CloseIcon from '@mui/icons-material/Close'
import { Alert, Box, IconButton, Snackbar } from '@mui/material'
import React from 'react'

export enum SnackStatus {
  Error = 'error',
  Success = 'success',
  None = 'none'
}

export interface SnackbarActionProps {
  status: SnackStatus
  message: string
  open: boolean
}

export default function SnackbarAction({ status, message, open }: SnackbarActionProps) {
  const [openSnackBar, setOpenSnackBar] = React.useState(open)

  const isError = React.useMemo(() => status === SnackStatus.Error, [status])

  React.useEffect(() => {
    setOpenSnackBar(open)
  }, [open])

  const handleClose = () => {
    setOpenSnackBar(false)
  }

  return (
    <Snackbar open={openSnackBar} onClose={handleClose}>
      <Alert severity={isError ? 'error' : 'success'} sx={{ alignItems: 'center' }}>
        <Box display="flex" justifyContent="center" flexDirection="row" alignItems="center">
          <CustomTypography color="textSecondary" variant="body1">
            {message}
          </CustomTypography>
          <IconButton aria-label="close" color="inherit" sx={{ p: 0.5 }} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Alert>
    </Snackbar>
  )
}
