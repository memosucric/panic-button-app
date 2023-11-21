import { useForm, SubmitHandler } from 'react-hook-form'
import { Button } from '@mui/material'
import BoxWrapperColumn from 'src/components/Wrappers/BoxWrapperColumn'
import * as React from 'react'

import {
  Config,
  DEFAULT_VALUES_KEYS,
  DEFAULT_VALUES_TYPE,
  ExecConfig,
  PARAMETERS_CONFIG,
  PositionConfig
} from 'src/config/strategies/manager'
import { PositionType } from 'src/contexts/types'
import { PossibleExecutionTypeValues } from './Types'
import InputRadio from './InputRadio'
import { Label } from './Label'
import { Title } from './Title'
import { trimAll } from 'src/utils/string'
import BoxWrapperRow from 'src/components/Wrappers/BoxWrapperRow'
import { PercentageText } from './PercentageText'
import { Modal } from '../Modal'
import Tooltip from '@mui/material/Tooltip'
import CustomTypography from 'src/components/CustomTypography'
import InfoIcon from '@mui/icons-material/Info'
import { ChangeEvent } from 'react'

interface FormProps {
  config: ExecConfig
  position: PositionType
}

const Form = (props: FormProps) => {
  const { config, position } = props
  const { commonConfig, positionConfig } = config

  const [open, setOpen] = React.useState(false)

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
    setValue,
    clearErrors,
    watch
  } = useForm<any>({
    defaultValues,
    mode: 'onChange'
  })

  const watchStrategy = watch('strategy')
  const watchMaxSlippage = watch('max_slippage')
  const watchPercentage = watch('percentage')

  const refSubmitButton = React.useRef<HTMLButtonElement>(null)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const triggerSubmit = () => {
    refSubmitButton?.current?.click()
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit: SubmitHandler<any> = async (data: any) => {
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

    const body = JSON.stringify(trimAll(params))
    console.log('body', body)
  }

  const specificParameters: Config[] =
    (positionConfig as PositionConfig[])?.find(
      (item: PositionConfig) => item.function_name === watchStrategy
    )?.parameters ?? []

  const parameters = [...commonConfig, ...specificParameters]

  const isExecuteButtonDisabled =
    Object.keys(errors).length > 0 || isSubmitting || !isDirty || !isValid

  return (
    <>
      <form id="hook-form" onSubmit={handleSubmit(onSubmit)}>
        <BoxWrapperColumn gap={2}>
          <BoxWrapperColumn gap={6}>
            <BoxWrapperColumn gap={2}>
              <Title title={'Exit strategies'} />
              <BoxWrapperColumn gap={2}>
                <InputRadio
                  name={'strategy'}
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    // Clear fields
                    setValue('percentage', null, { shouldValidate: true })
                    setValue('max_slippage', null, { shouldValidate: true })
                    setValue('rewards_address', null, { shouldValidate: true })
                    setValue('token_out_address', null, { shouldValidate: true })
                    setValue('bpt_address', null, { shouldValidate: true })
                  }}
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
              <Title title={'Parameters'} />
              {parameters.map((parameter: Config, index: number) => {
                const { name, label = '', type, rules, options } = parameter

                if (type === 'constant') {
                  return null
                }

                let haveMinAndMaxRules = false
                let onChange = undefined
                const haveOptions = !!options?.length

                const min = rules?.min
                const max = rules?.max
                haveMinAndMaxRules = min !== undefined && max !== undefined

                if ((name === 'percentage' || name === 'max_slippage') && type === 'input') {
                  onChange = (values: any) => {
                    const value = values?.floatValue
                    if (!value) {
                      setError(name as any, {
                        type: 'manual',
                        message: `Please fill in the field ${label}`
                      })
                    } else {
                      clearErrors(label as any)
                    }
                  }
                }

                const onClickApplyMax = () => {
                  if (max !== undefined) {
                    clearErrors(name as any)
                    setValue(name as any, max, { shouldValidate: true })
                  }
                }

                if (haveMinAndMaxRules) {
                  const isMaxButtonDisabled =
                    name === 'percentage' ? watchPercentage == max : watchMaxSlippage == max

                  return (
                    <BoxWrapperColumn gap={2} key={index}>
                      <BoxWrapperRow sx={{ justifyContent: 'space-between' }}>
                        <BoxWrapperRow gap={2}>
                          <Label title={label} />
                          {name === 'max_slippage' ? (
                            <Tooltip
                              title={
                                <CustomTypography variant="body2" sx={{ color: 'common.white' }}>
                                  The max slippage field is capped in 10% to start
                                </CustomTypography>
                              }
                              sx={{ ml: 1, cursor: 'pointer' }}
                            >
                              <InfoIcon sx={{ fontSize: 24, cursor: 'pointer' }} />
                            </Tooltip>
                          ) : null}
                        </BoxWrapperRow>

                        <Button
                          disabled={isMaxButtonDisabled}
                          onClick={onClickApplyMax}
                          variant="contained"
                        >
                          Max
                        </Button>
                      </BoxWrapperRow>
                      <PercentageText
                        name={name}
                        control={control}
                        rules={{ required: `Please fill in the field ${label}` }}
                        minValue={name === 'max_slippage' ? 0 : 1}
                        maxValue={name === 'max_slippage' ? 10 : 100}
                        placeholder={
                          PARAMETERS_CONFIG[name as DEFAULT_VALUES_KEYS].placeholder as string
                        }
                        errors={errors}
                        onChange={onChange}
                      />
                    </BoxWrapperColumn>
                  )
                }

                if (haveOptions) {
                  return (
                    <BoxWrapperColumn gap={2} key={index}>
                      <Label title={label} />
                      <InputRadio
                        name={name}
                        control={control}
                        options={options?.map((item) => {
                          return {
                            name: item.label,
                            value: item.value
                          }
                        })}
                      />
                    </BoxWrapperColumn>
                  )
                }

                return null
              })}
            </BoxWrapperColumn>
          </BoxWrapperColumn>

          <Button
            onClick={handleClickOpen}
            variant="contained"
            size="large"
            sx={{ height: '60px', marginTop: '30px' }}
            disabled={isExecuteButtonDisabled}
          >
            Execute
          </Button>
          <button hidden={true} ref={refSubmitButton} type={'submit'} />
        </BoxWrapperColumn>
      </form>
      <Modal open={open} handleClose={handleClose} />
    </>
  )
}

export default Form
