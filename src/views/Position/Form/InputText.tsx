import React from 'react'
import { Controller } from 'react-hook-form'
import { TextFieldProps } from '@mui/material/TextField/TextField'
import { InputProps } from 'src/views/Position/Form/Types'
import { TextField } from '@mui/material'

export interface CustomInputPropsProps {
  label: string
  textFieldType?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  errors: any
  rules?: any
}

export type ControlledTextFieldProps = InputProps & TextFieldProps & CustomInputPropsProps

const InputText = (props: ControlledTextFieldProps) => {
  const { name, defaultValue, control, textFieldType, errors, onChange, label, ...rest } = props

  return (
    <Controller
      name={name as any}
      control={control}
      defaultValue={(defaultValue as any) ?? ''}
      render={({ field }) => (
        <TextField
          type={textFieldType}
          placeholder={`Enter a value for ${label}`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (onChange) onChange(e)
            field.onChange(e)
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
            width: '100%'
          }}
        />
      )}
      {...rest}
    />
  )
}

export default InputText
