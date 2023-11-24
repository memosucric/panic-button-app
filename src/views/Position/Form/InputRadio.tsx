import React from 'react'
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { Controller } from 'react-hook-form'
import BoxWrapperRow from 'src/components/Wrappers/BoxWrapperRow'
import Tooltip from '@mui/material/Tooltip'
import CustomTypography from 'src/components/CustomTypography'
import InfoIcon from '@mui/icons-material/Info'
import { InputProps } from 'src/views/Position/Form/Types'

export interface Option {
  name: string
  value: string
  description?: string
}

export interface InputWithOptionsProps extends InputProps {
  options: Option[]
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const InputRadio: React.FC<InputWithOptionsProps> = ({
  name,
  options,
  control,
  onChange: onChangeRadio
}: InputWithOptionsProps) => {
  const generateRadioOptions = () =>
    options.map((option: any, index: number) => {
      return (
        <BoxWrapperRow sx={{ justifyContent: 'flex-start' }} key={index}>
          <FormControlLabel value={option.value} label={option.name} control={<Radio />} />
          {option?.description ? (
            <Tooltip
              title={
                <CustomTypography variant="body2" sx={{ color: 'common.white' }}>
                  {option?.description}
                </CustomTypography>
              }
              sx={{ ml: 1, cursor: 'pointer' }}
            >
              <InfoIcon sx={{ fontSize: 24, cursor: 'pointer' }} />
            </Tooltip>
          ) : null}
        </BoxWrapperRow>
      )
    })

  return (
    <FormControl component="fieldset">
      <Controller
        name={name}
        control={control}
        rules={{ required: `${name} is required` } as any}
        render={({ field: { onChange, value } }) => (
          <RadioGroup
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (onChangeRadio) onChangeRadio(e)
              onChange(e)
            }}
          >
            {generateRadioOptions()}
          </RadioGroup>
        )}
      />
    </FormControl>
  )
}

export default InputRadio
