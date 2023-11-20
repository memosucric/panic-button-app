import React, { ForwardedRef } from 'react'
import { Controller } from 'react-hook-form'
import { TextFieldProps } from '@mui/material/TextField/TextField'
import { InputProps } from 'src/views/Position/Form/Types'
import { TextField } from '@mui/material'
import { NumericFormat } from 'react-number-format'

interface PercentageNumberFormatProps {
  inputRef: (instance: typeof NumericFormat | null) => void
  name: string
}

// eslint-disable-next-line react/display-name
const PercentageNumberFormat = React.forwardRef<
  PercentageNumberFormatProps,
  PercentageNumberFormatProps
>((props: PercentageNumberFormatProps, ref: ForwardedRef<PercentageNumberFormatProps>) => {
  return <NumericFormat {...props} getInputRef={ref} allowNegative={false} valueIsNumericString />
})

export interface CustomInputPropsProps {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  errors: any
  rules?: any
}

export type ControlledTextFieldProps = InputProps & TextFieldProps & CustomInputPropsProps

export const PercentageText = (props: ControlledTextFieldProps) => {
  const { name, rules, defaultValue, control, errors, onChange, ...restProps } = props

  return (
    <Controller
      name={name as any}
      control={control}
      rules={rules}
      defaultValue={(defaultValue as any) ?? ''}
      render={({ field }) => (
        <TextField
          InputProps={{
            inputComponent: PercentageNumberFormat as any
          }}
          inputProps={{
            value: field?.value,
            suffix: '%',
            isAllowed: (values: any) => {
              return (
                (values.floatValue! >= 0 && values.floatValue! <= 100) ||
                values.floatValue === undefined
              )
            },
            onValueChange: (values: any) => {
              if (onChange) onChange(values)
              field.onChange(values.floatValue)
            }
          }}
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
            width: '100%',
            '& input[type=number]': {
              MozAppearance: 'textfield'
            },
            '& input[type=number]::-webkit-outer-spin-button': {
              WebkitAppearance: 'none',
              margin: 0
            },
            '& input[type=number]::-webkit-inner-spin-button': {
              WebkitAppearance: 'none',
              margin: 0
            }
          }}
          {...restProps}
        />
      )}
    />
  )
}
