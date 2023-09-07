import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { Button, RadioGroup, FormControlLabel, Radio, TextField, Divider } from '@mui/material'
import BoxWrapperColumn from 'src/components/Wrappers/BoxWrapperColumn'
import { Parameter, StrategyContent } from 'src/config/strategiesManager'
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

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

interface TitleProps {
  title: string
}

const Title = ({ title }: TitleProps) => {
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

interface FormProps {
  strategies: StrategyContent[]
}

const Form = (props: FormProps) => {
  const { strategies } = props

  const [open, setOpen] = React.useState(false)

  const [openSuccess, setOpenSuccess] = React.useState(false)
  const [openError, setOpenError] = React.useState(false)

  const {
    formState: { errors },
    handleSubmit,
    control,
    watch
  } = useForm<any>({
    defaultValues: {
      strategy: strategies[0].name
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
        setOpenSuccess(true)
      } else {
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
              <BoxWrapperColumn gap={1}>
                <Primary title={'Strategies'} />
                <Divider sx={{ borderBottomWidth: 5 }} />
              </BoxWrapperColumn>
              <BoxWrapperColumn gap={2}>
                <Title title={'Choose a strategy'} />
                <Controller
                  name="strategy"
                  control={control}
                  rules={{ required: 'Strategy is required' }}
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      {strategies.map((strategy: StrategyContent, index: number) => {
                        return (
                          <FormControlLabel
                            key={index}
                            value={strategy.name}
                            control={<Radio />}
                            label={strategy.name}
                          />
                        )
                      })}
                    </RadioGroup>
                  )}
                />
              </BoxWrapperColumn>
            </BoxWrapperColumn>

            <BoxWrapperColumn gap={2}>
              <BoxWrapperColumn gap={1}>
                <Primary title={'Parameters'} />
                <Divider sx={{ borderBottomWidth: 5 }} />
              </BoxWrapperColumn>
              <BoxWrapperColumn gap={2}>
                <Title title={'Fill in inputs'} />
                {strategies
                  .find((strategy: StrategyContent) => strategy.name === watchStrategy)
                  ?.parameters.map((parameter: Parameter, index: number) => {
                    const { name, type, label, placeholder, default: defaultValue = '' } = parameter
                    return (
                      <Controller
                        name={name}
                        control={control}
                        key={index}
                        rules={{ required: `${label} is required` }}
                        defaultValue={defaultValue}
                        render={({ field }) => (
                          <TextField
                            type={type}
                            label={label}
                            placeholder={placeholder}
                            onChange={field.onChange}
                            value={field.value || ''}
                            error={!!errors[name]}
                            helperText={errors[name]?.message?.toString()}
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
                    )
                  })}
              </BoxWrapperColumn>
            </BoxWrapperColumn>
          </BoxWrapperColumn>
          <Button
            onClick={handleClickOpen}
            variant="contained"
            size="large"
            sx={{ height: '60px', marginTop: '30px' }}
            disabled={Object.keys(errors).length > 0}
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
            Are you sure you want to execute the {watchStrategy} strategy?
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
          Strategy executed successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          Error executing strategy!
        </Alert>
      </Snackbar>
    </>
  )
}

export default Form
