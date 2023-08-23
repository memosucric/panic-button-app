import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { Button, RadioGroup, FormControlLabel, Radio, TextField, Divider } from '@mui/material'
import BoxWrapperColumn from 'src/components/Wrappers/BoxWrapperColumn'
import { Parameter, StrategyContent } from 'src/config/strategiesManager'
import CustomTypography from 'src/components/CustomTypography'
import * as React from 'react'
import Primary from 'src/views/Position/Title/Primary'

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

  const onSubmit: SubmitHandler<any> = (data: any) => {
    // Do something here
    console.log('data', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
          type="submit"
          className="submit"
          variant="contained"
          size="large"
          sx={{ height: '60px', marginTop: '30px' }}
          disabled={Object.keys(errors).length > 0}
        >
          Submit
        </Button>
      </BoxWrapperColumn>
    </form>
  )
}

export default Form
