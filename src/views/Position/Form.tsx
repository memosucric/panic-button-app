import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { Button, RadioGroup, FormControlLabel, Radio, TextField } from '@mui/material'
import BoxWrapperColumn from 'src/components/Wrappers/BoxWrapperColumn'
import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import BoxWrapperRow from 'src/components/Wrappers/BoxWrapperRow'
import {
  Config,
  DEFAULT_VALUES_TYPE,
  ExecConfig,
  PositionConfig
} from 'src/config/strategies/manager'
import { PositionType } from 'src/contexts/types'
import { PossibleExecutionTypeValues } from 'src/views/Position/Form/Types'
import InputRadio from 'src/views/Position/Form/InputRadio'
import { FormLabel } from 'src/views/Position/Form/FormLabel'
import { FormTitle } from 'src/views/Position/Form/FormTitle'
import InputText from 'src/views/Position/Form/InputText'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

// const EXECUTION_TYPE: ExecutionType[] = [{ name: 'Simulate' }, { name: 'Execute' }]

interface FormProps {
  config: ExecConfig
  position: PositionType
}

const Form = (props: FormProps) => {
  const { config, position } = props
  const { commonConfig, positionConfig } = config

  const [open, setOpen] = React.useState(false)

  const [openSuccess, setOpenSuccess] = React.useState(false)
  const [link, setLink] = React.useState<Maybe<string>>(null)
  const [message, setMessage] = React.useState<Maybe<string>>(null)
  const [openError, setOpenError] = React.useState(false)

  const defaultValues: DEFAULT_VALUES_TYPE = {
    position_id: position?.position_id ?? null,
    blockchain: position?.blockchain ?? null,
    protocol: position?.protocol ?? null,
    execution_type: 'Simulate' as PossibleExecutionTypeValues,
    strategy: positionConfig[0]?.function_name ?? null,
    percentage: null,
    rewards_address: null,
    max_slippage: null,
    token_out_address: null,
    bpt_address: null
  }

  const {
    formState: { errors, isSubmitting, isDirty, isValid },
    handleSubmit,
    control,
    setError,
    clearErrors,
    watch
  } = useForm<any>({
    defaultValues
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
      const exitArguments = {
        rewards_address: data?.rewards_address,
        max_slippage: data?.max_slippage,
        token_out_address: data?.token_out_address,
        bpt_address: data?.bpt_address
      }

      const params = {
        position_id: data?.position_id,
        blockchain: data?.blockchain,
        protocol: data?.protocol,
        strategy: data?.strategy,
        execution_type: data?.execution_type,
        percentage: data?.percentage,
        exit_arguments: exitArguments
      }

      const body = JSON.stringify(params)

      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      })

      const result = await response.json()
      if (response.status === 200 && result.data.status) {
        setLink(result?.data?.link)
        setMessage(result?.data?.message)
        setOpenSuccess(true)
      } else {
        setLink(null)
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

  const specificParameters: Config[] =
    (positionConfig as PositionConfig[])?.find(
      (item: PositionConfig) => item.function_name === watchStrategy
    )?.parameters ?? []

  return (
    <>
      <form id="hook-form" onSubmit={handleSubmit(onSubmit)}>
        <BoxWrapperColumn gap={2}>
          <BoxWrapperColumn gap={6}>
            <BoxWrapperColumn gap={2}>
              <FormTitle title={'Exit strategies'} />
              <BoxWrapperColumn gap={2}>
                <InputRadio
                  name={'strategy'}
                  options={positionConfig.map((item: PositionConfig) => {
                    return {
                      name: item.label,
                      value: item.function_name,
                      description: item.description
                    }
                  })}
                  control={control}
                />
              </BoxWrapperColumn>
            </BoxWrapperColumn>

            <BoxWrapperColumn gap={2}>
              <FormTitle title={'Common parameters'} />
              {commonConfig.map((commonConfigItem: Config, index: number) => {
                const { name, label = '', type, rules } = commonConfigItem

                if (type === 'constant') {
                  return null
                }

                const min = rules?.min
                const max = rules?.max
                const existMinAndMax = !!(min !== undefined && max !== undefined)

                return (
                  <BoxWrapperColumn gap={2} key={index}>
                    <FormLabel title={label} />
                    <InputText
                      textFieldType={existMinAndMax ? 'number' : 'string'}
                      name={name}
                      label={label}
                      control={control}
                      rules={{ required: `${label} is required` }}
                      placeholder={`Enter a value for ${label}`}
                      errors={errors}
                      onChange={
                        existMinAndMax
                          ? (e) => {
                              const value = e.target.value
                              if (+value > max) {
                                e.target.value = max + ''
                              }
                              if (+value < min) {
                                e.target.value = min + ''
                              }

                              if (!value) {
                                setError(label as any, {
                                  type: 'manual',
                                  message: `${label} is required`
                                })
                              } else {
                                clearErrors(label as any)
                              }
                            }
                          : undefined
                      }
                    />
                  </BoxWrapperColumn>
                )
              })}
            </BoxWrapperColumn>

            {specificParameters?.length > 0 ? (
              <BoxWrapperColumn gap={2}>
                <FormTitle title={'Specific parameters'} />
                {specificParameters?.map((item: Config, index: number) => {
                  const { name, label = '', type, rules, options } = item

                  if (type === 'constant') {
                    return null
                  }

                  const min = rules?.min
                  const max = rules?.max
                  const haveRules = !!(min !== undefined && max !== undefined)

                  if (haveRules) {
                    return (
                      <BoxWrapperColumn gap={2} key={index}>
                        <FormLabel title={label} />
                        <Controller
                          name={name}
                          control={control}
                          rules={{ required: `${label} is required` }}
                          render={({ field }) => (
                            <TextField
                              type={haveRules ? 'number' : 'string'}
                              placeholder={`Enter a value for ${label}`}
                              onChange={
                                haveRules
                                  ? (e) => {
                                      const value = e.target.value
                                      if (+value > max) {
                                        e.target.value = max + ''
                                      }
                                      if (+value < min) {
                                        e.target.value = min + ''
                                      }

                                      if (!value) {
                                        setError(field.name, {
                                          type: 'manual',
                                          message: `${label} is required`
                                        })
                                      } else {
                                        clearErrors(field.name)
                                      }

                                      return field.onChange(e)
                                    }
                                  : (e) => {
                                      return field.onChange(e)
                                    }
                              }
                              value={field.value || ''}
                              error={!!errors[field.name]}
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
                    )
                  }

                  const haveOptions = !!options?.length

                  if (haveOptions) {
                    return (
                      <BoxWrapperColumn gap={2} key={index}>
                        <FormLabel title={label} />
                        <Controller
                          name={name}
                          control={control}
                          rules={{ required: `${label} is required` }}
                          render={({ field }) => (
                            <RadioGroup {...field}>
                              {options?.map(
                                (item: { label: string; value: string }, index: number) => {
                                  return (
                                    <BoxWrapperRow
                                      sx={{ justifyContent: 'flex-start' }}
                                      key={index}
                                    >
                                      <FormControlLabel
                                        value={item.value}
                                        control={<Radio />}
                                        label={item.label}
                                      />
                                    </BoxWrapperRow>
                                  )
                                }
                              )}
                            </RadioGroup>
                          )}
                        />
                      </BoxWrapperColumn>
                    )
                  }

                  return null
                })}
              </BoxWrapperColumn>
            ) : null}
          </BoxWrapperColumn>
          <Button
            onClick={handleClickOpen}
            variant="contained"
            size="large"
            sx={{ height: '60px', marginTop: '30px' }}
            disabled={Object.keys(errors).length > 0 || isSubmitting || !isDirty || !isValid}
          >
            Execute
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
            No, cancel
          </Button>
          <Button
            onClick={handleAgree}
            variant="contained"
            size="large"
            sx={{ height: '60px', marginTop: '30px' }}
            form="hook-form"
            autoFocus
          >
            Yes, continue
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          {message}. Check it out{' '}
          <a href={`${link}`} target="_blank" rel="noreferrer">
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
