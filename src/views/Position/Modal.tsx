import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import * as React from 'react'
import { HEADER_HEIGHT } from '../../components/Layout/Header'

interface ModalProps {
  open: boolean
  handleClose: () => void
}

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
        top: HEADER_HEIGHT
      }}
    >
      <Box sx={{ padding: '20px' }}>
        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent>Body</DialogContent>
      <DialogActions>Actions</DialogActions>
    </Dialog>
  )
}
