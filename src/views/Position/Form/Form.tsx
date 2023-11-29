import { useForm, SubmitHandler } from 'react-hook-form'
import { Button } from '@mui/material'
import BoxWrapperColumn from 'src/components/Wrappers/BoxWrapperColumn'
import * as React from 'react'

import {
  Config,
  DEFAULT_VALUES_KEYS,
  DEFAULT_VALUES_TYPE,
  PARAMETERS_CONFIG,
  PositionConfig
} from 'src/config/strategies/manager'
import InputRadio from './InputRadio'
import { Label } from './Label'
import { Title } from './Title'
import BoxWrapperRow from 'src/components/Wrappers/BoxWrapperRow'
import { PercentageText } from './PercentageText'
import { Modal } from '../Modal/Modal'
import Tooltip from '@mui/material/Tooltip'
import CustomTypography from 'src/components/CustomTypography'
import InfoIcon from '@mui/icons-material/Info'
import { useApp } from 'src/contexts/app.context'
import {ExecuteStrategyStatus, Position, SetupItemStatus, SetupStatus, Strategy} from 'src/contexts/state'
import {
  clearExecutionStage, clearSetupWithoutCreate,
  setSetupCreate, setSetupCreateStatus,
  setSetupStatus,
  setStrategy,
  setStrategyStatus
} from 'src/contexts/reducers'
import { getStrategy } from '../../../utils/strategies'

const Form = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { dispatch, state } = useApp()
  const { selectedPosition: position } = state

  const { positionConfig, commonConfig } = getStrategy(position as Position)

  const [open, setOpen] = React.useState(false)

  // If we don't do this, the application will rerender every time
  const defaultValues: DEFAULT_VALUES_TYPE = React.useMemo(() => {
    return {
      position_id: position?.position_id ?? null,
      blockchain: position?.blockchain ?? null,
      protocol: position?.protocol ?? null,
      strategy: positionConfig[0]?.function_name?.trim(),
      percentage: null,
      rewards_address: null,
      max_slippage: null,
      token_out_address: null,
      bpt_address: null
    }
  }, [position, positionConfig])

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
    mode: 'all'
  })

  const watchStrategy = watch('strategy')
  const watchMaxSlippage = watch('max_slippage')
  const watchPercentage = watch('percentage')

  // We need to do this, because the react hook form default values are not working properly
  React.useEffect(() => {
    if (defaultValues) {
      setValue('position_id', position?.position_id ?? null)
      setValue('blockchain', position?.blockchain ?? null)
      setValue('protocol', position?.protocol ?? null)
      setValue('strategy', positionConfig[0]?.function_name ?? null)
      setValue('percentage', null)
      setValue('rewards_address', null)
      setValue('max_slippage', null)
      setValue('token_out_address', null)
      setValue('bpt_address', null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    // Get label by value for the token_out_address in the positionConfig
    const tokenOutAddressLabel = positionConfig
      .find((item: PositionConfig) => item.function_name === data?.strategy)
      ?.parameters.find((item: Config) => item.name === 'token_out_address')
      ?.options.find((item: any) => item.value === data?.token_out_address)?.label

    const setup = {
      id: data?.strategy,
      name: data?.strategy,
      description:
        positionConfig.find((item: PositionConfig) => item.function_name === data?.strategy)
          ?.description ?? '',
      percentage: data?.percentage,
      blockchain: data?.blockchain,
      protocol: data?.protocol,
      position_id: data?.position_id,
      position_name: position?.lptoken_name,
      rewards_address: data?.rewards_address,
      max_slippage: data?.max_slippage,
      token_out_address: data?.token_out_address,
      token_out_address_label: tokenOutAddressLabel,
      bpt_address: data?.bpt_address
    }


    dispatch(setSetupCreate(setup as Strategy))

    dispatch(setSetupStatus('create' as SetupStatus))

    dispatch(clearSetupWithoutCreate())

  }

  const specificParameters: Config[] =
    (positionConfig as PositionConfig[])?.find(
      (item: PositionConfig) => item.function_name === watchStrategy
    )?.parameters ?? []

  const parameters = [...commonConfig, ...specificParameters]

  const isExecuteButtonDisabled = isSubmitting || !isValid

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
                  onChange={(e: any) => {
                    // Clear fields
                    setValue('percentage', null)
                    setValue('max_slippage', null)
                    setValue('rewards_address', null)
                    setValue('token_out_address', null)
                    setValue('bpt_address', null)
                  }}
                  options={positionConfig.map((item: PositionConfig) => {
                    return {
                      name: item.label,
                      value: item.function_name.trim(),
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

                const haveOptions = options?.length ?? 0 > 0
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
                                  Please enter a slippage from {min}% to {max}%
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
                        key={Date.now()}
                        name={name}
                        control={control}
                        rules={{ required: `Please fill in the field ${label}` }}
                        minValue={min || 0}
                        maxValue={max || 100}
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
                        options={
                          options?.map((item) => {
                            return {
                              name: item?.label ?? '',
                              value: item?.value ?? ''
                            }
                          }) ?? []
                        }
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
            type={'submit'}
          >
            Execute
          </Button>
        </BoxWrapperColumn>
      </form>
      <Modal open={open} handleClose={handleClose} />
    </>
  )
}

export default Form
