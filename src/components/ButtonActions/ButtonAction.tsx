import SnackbarAction, { SnackStatus } from 'src/components/ButtonActions/SnackbarAction'
import useHandleAction from 'src/hooks/useHandleAction'
import ModalDialog from 'src/components/Modals/ModalDialog'
import BoxWrapperRow from 'src/components/Wrappers/BoxWrapperRow'
import { Button, CircularProgress } from '@mui/material'
import React from 'react'

interface ButtonActionProps {
  actionURL: string
  buttonTitle: string
  modalDialogTitle: string
  modalDialogDescription: string
  successMessage: Maybe<string>
  component?: React.ReactNode
  okButtonTitle?: string
  cancelButtonTitle?: string
}

export default function ButtonAction(props: ButtonActionProps) {
  const {
    buttonTitle,
    modalDialogTitle,
    modalDialogDescription,
    successMessage,
    actionURL,
    component,
    okButtonTitle = 'Agree',
    cancelButtonTitle = 'Disagree'
  } = props

  const { onClick, open, loading, handleClose, error, data } = useHandleAction(actionURL)

  const status = React.useMemo(() => {
    if (error && data !== null) {
      return SnackStatus.Error
    }
    if (data && !error) {
      return SnackStatus.Success
    }
    return SnackStatus.None
  }, [error, data]) as SnackStatus

  const message = React.useMemo(() => {
    if (error && data !== null) {
      return error?.message || ''
    }
    if (data && !error) {
      return successMessage || ''
    }
    return ''
  }, [error, successMessage, data])

  return (
    <BoxWrapperRow justifyContent="flex-start" mb="10px" gap="10px">
      <Button
        onClick={onClick}
        variant="contained"
        disabled={loading}
        {...(loading
          ? {
              endIcon: <CircularProgress color="primary" size={20} />
            }
          : {})}
      >
        {buttonTitle}
      </Button>
      <ModalDialog
        open={open}
        title={modalDialogTitle}
        description={modalDialogDescription}
        handleClose={handleClose}
        component={component}
        okButtonTitle={okButtonTitle}
        cancelButtonTitle={cancelButtonTitle}
      />
      <SnackbarAction status={status} message={message} open={!!data} />
    </BoxWrapperRow>
  )
}
