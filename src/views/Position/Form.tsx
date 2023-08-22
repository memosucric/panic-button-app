import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { Box, Button, RadioGroup, FormControlLabel, Radio, TextField, Divider } from '@mui/material'
import BoxWrapperColumn from 'src/components/Wrappers/BoxWrapperColumn'
import { StrategyContent } from 'src/config/strategiesManager'
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

  const { handleSubmit, control, watch } = useForm<any>({
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
                control={control}
                rules={{ required: 'Strategy is required' }}
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
                ?.parameters.map(
                  (
                    parameter: {
                      name: string
                      label: string
                      type: 'number' | 'text'
                    },
                    index: number
                  ) => {
                    const { name, type, label } = parameter
                    return (
                      <Box key={index}>
                        <TextField
                          type={type}
                          name={name}
                          label={label}
                          placeholder={label}
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
                      </Box>
                    )
                  }
                )}
            </BoxWrapperColumn>
          </BoxWrapperColumn>
        </BoxWrapperColumn>
        <Button
          type="submit"
          className="submit"
          variant="contained"
          size="large"
          sx={{ height: '60px', marginTop: '30px' }}
        >
          Submit
        </Button>
      </BoxWrapperColumn>
    </form>
  )
}

export default Form
