import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { Button, RadioGroup, FormControlLabel, Radio, Divider, TextField } from '@mui/material'
import BoxWrapperColumn from 'src/components/Wrappers/BoxWrapperColumn'
import { ExecConfig } from 'src/config/strategiesManager'
import CustomTypography from 'src/components/CustomTypography'
import * as React from 'react'
import Primary from 'src/views/Position/Title/Primary'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import BoxWrapperRow from 'src/components/Wrappers/BoxWrapperRow'
import Tooltip from '@mui/material/Tooltip'
import InfoIcon from '@mui/icons-material/Info'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

interface FormLabelProps {
  title: string
}

const FormLabel = ({ title }: FormLabelProps) => {
  return (
    <CustomTypography
      sx={{
        fontFamily: 'IBM Plex Sans',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: 18,
        lineHeight: '18px',
        color: 'custom.grey.dark'
      }}
    >
      {title}
    </CustomTypography>
  )
}

interface FormTitleProps {
  title: string
}

const FormTitle = ({ title }: FormTitleProps) => {
  return (
    <BoxWrapperColumn gap={1}>
      <Primary title={title} />
      <Divider sx={{ borderBottomWidth: 5 }} />
    </BoxWrapperColumn>
  )
}

export type PossibleExecutionTypeValues = 'Simulate' | 'Normal execution'

interface ExecutionType {
  name: PossibleExecutionTypeValues
}

const EXECUTION_TYPE: ExecutionType[] = [{ name: 'Simulate' }, { name: 'Normal execution' }]

interface FormProps {
  strategies: ExecConfig[]
}

const Form = (props: FormProps) => {
  const { strategies } = props

  const [open, setOpen] = React.useState(false)

  const [openSuccess, setOpenSuccess] = React.useState(false)
  const [trx, setTrx] = React.useState<Maybe<string>>(null)
  const [openError, setOpenError] = React.useState(false)

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    control,
    setError,
    clearErrors,
    watch
  } = useForm<any>({
    defaultValues: {
      strategy: strategies[0].name,
      executionType: 'Simulate',
      percentage: 100
    }
  })

  const watchStrategy = watch('strategy')

  const refSubmitButtom = React.useRef<HTMLButtonElement>(null)

  const triggerSubmit = () => {
    refSubmitButtom?.current?.click()
  }

  const handleAgree = () => {
    triggerSubmit()
    handleClose()
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()
      if (response.status === 200 && result.data.status) {
        setTrx(result?.data?.trx)
        setOpenSuccess(true)
      } else {
        setTrx(null)
        setOpenError(true)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleCloseSuccess = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenSuccess(false)
  }

  const handleCloseError = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenError(false)
  }

  return (
    <>
      <form id="hook-form" onSubmit={handleSubmit(onSubmit)}>
        <BoxWrapperColumn gap={2}>
          <BoxWrapperColumn gap={6}>
            <BoxWrapperColumn gap={2}>
              <FormTitle title={'Strategies'} />
              <BoxWrapperColumn gap={2}>
                <FormLabel title={'Choose a strategy'} />
                <Controller
                  name="strategy"
                  control={control}
                  rules={{ required: 'Strategy is required' }}
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      {strategies.map((strategy: ExecConfig, index: number) => {
                        return (
                          <BoxWrapperRow sx={{ justifyContent: 'flex-start' }} key={index}>
                            <FormControlLabel
                              value={strategy.name}
                              control={<Radio />}
                              label={strategy.name}
                            />
                            {strategy?.description ? (
                              <Tooltip
                                title={
                                  <CustomTypography variant="body2" sx={{ color: 'common.white' }}>
                                    {strategy?.description}
                                  </CustomTypography>
                                }
                                sx={{ ml: 1, cursor: 'pointer' }}
                              >
                                <InfoIcon sx={{ fontSize: 24, cursor: 'pointer' }} />
                              </Tooltip>
                            ) : null}
                          </BoxWrapperRow>
                        )
                      })}
                    </RadioGroup>
                  )}
                />
              </BoxWrapperColumn>
            </BoxWrapperColumn>

            <BoxWrapperColumn gap={2}>
              <FormTitle title={'Execution type'} />
              <BoxWrapperColumn gap={2}>
                <FormLabel title={'Choose an execution type'} />
                <Controller
                  name="executionType"
                  control={control}
                  rules={{ required: 'Execution type is required' }}
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      {EXECUTION_TYPE.map((executionType: ExecutionType, index: number) => {
                        return (
                          <FormControlLabel
                            key={index}
                            value={executionType.name}
                            control={<Radio />}
                            label={executionType.name}
                          />
                        )
                      })}
                    </RadioGroup>
                  )}
                />
              </BoxWrapperColumn>
            </BoxWrapperColumn>

            <BoxWrapperColumn gap={2}>
              <FormTitle title={'Parameters'} />
              <BoxWrapperColumn gap={2}>
                <FormLabel title={'Percentage'} />
                <Controller
                  name="percentage"
                  control={control}
                  rules={{ required: `Percentage is required` }}
                  render={({ field }) => (
                    <TextField
                      type="number"
                      placeholder="Percentage"
                      onChange={(e) => {
                        const value = e.target.value
                        if (+value > 100) {
                          e.target.value = '100'
                        }
                        if (+value < 0) {
                          e.target.value = '0'
                        }

                        if (!value) {
                          setError(field.name, {
                            type: 'manual',
                            message: `Percentage is required`
                          })
                        } else {
                          clearErrors(field.name)
                        }

                        return field.onChange(e)
                      }}
                      value={field.value || ''}
                      error={!!errors[field.name]}
                      inputProps={{ min: 1, max: 100 }}
                      helperText={errors[field.name]?.message?.toString()}
                      sx={{
                        fontFamily: 'IBM Plex Sans',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        fontSize: 18,
                        lineHeight: '18px',
                        color: 'custom.grey.dark',
                        width: '100%'
                      }}
                    />
                  )}
                />
              </BoxWrapperColumn>
            </BoxWrapperColumn>
          </BoxWrapperColumn>
          <Button
            onClick={handleClickOpen}
            variant="contained"
            size="large"
            sx={{ height: '60px', marginTop: '30px' }}
            disabled={Object.keys(errors).length > 0 || isSubmitting}
          >
            Submit
          </Button>
          <button hidden={true} ref={refSubmitButtom} type={'submit'} />
        </BoxWrapperColumn>
      </form>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Execute ${watchStrategy} strategy`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to execute the "{watchStrategy}" strategy?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="contained"
            size="large"
            sx={{ height: '60px', marginTop: '30px' }}
          >
            Disagree
          </Button>
          <Button
            onClick={handleAgree}
            variant="contained"
            size="large"
            sx={{ height: '60px', marginTop: '30px' }}
            form="hook-form"
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          Strategy "{watchStrategy}" executed successfully! Check it out{' '}
          <a href={`${trx}`} target="_blank" rel="noreferrer">
            here
          </a>
        </Alert>
      </Snackbar>
      <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          Error executing the "{watchStrategy}" strategy!
        </Alert>
      </Snackbar>
    </>
  )
}

export default Form
