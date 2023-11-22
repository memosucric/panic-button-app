import BoxWrapperRow from 'src/components/Wrappers/BoxWrapperRow'
import { AccordionSummary } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CustomTypography from 'src/components/CustomTypography'
import AccordionDetails from '@mui/material/AccordionDetails'
import BoxWrapperColumn from 'src/components/Wrappers/BoxWrapperColumn'
import { formatPercentage } from 'src/utils/format'
import * as React from 'react'
import { AccordionWrapper } from 'src/components/Accordion/AccordionWrapper'
import { useApp } from 'src/contexts/app.context'

const LABEL_MAPPER = {
  description: {
    label: 'Strategy',
    order: 4
  },
  blockchain: {
    label: 'Blockchain',
    order: 1
  },
  protocol: {
    label: 'Protocol',
    order: 2
  },
  position_name: {
    label: 'Position name',
    order: 3
  },
  bpt_address: {
    label: 'BPT Address',
    order: 5
  },
  percentage: {
    label: 'Percentage',
    order: 6
  },
  max_slippage: {
    label: 'Max slippage',
    order: 7
  },
  rewards_address: {
    label: 'Rewards address',
    order: 8
  },
  token_out_address: {
    label: 'Token out address',
    order: 9
  }
}

export const SetupDetails = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { dispatch, state } = useApp()

  const { strategy } = state
  const { value } = strategy

  //filter value by LABEL_MAPPER and sort by order
  const parameters = value
    ? Object.keys(value)
        .filter((key) => LABEL_MAPPER[key as keyof typeof LABEL_MAPPER])
        .sort((a, b) => {
          return (
            LABEL_MAPPER[a as keyof typeof LABEL_MAPPER].order -
            LABEL_MAPPER[b as keyof typeof LABEL_MAPPER].order
          )
        })
        .map((key) => {
          return {
            key,
            label: LABEL_MAPPER[key as keyof typeof LABEL_MAPPER].label,
            value: value && value[key as keyof typeof value]
          }
        })
        .filter(({ value }) => value)
    : []

  return (
    <BoxWrapperRow gap={2} sx={{ m: 3, backgroundColor: 'custom.grey.light' }}>
      <AccordionWrapper sx={{ width: '100%' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <CustomTypography variant={'body2'}>Setup details</CustomTypography>
        </AccordionSummary>
        <AccordionDetails sx={{ justifyContent: 'flex-start', display: 'flex' }}>
          <BoxWrapperColumn sx={{ width: '100%' }}>
            {parameters.map(({ label, value, key }, index) => {
              if (!value || !label) return null

              let valueToDisplay = null
              if (key === 'percentage' || key === 'max_slippage') {
                valueToDisplay = formatPercentage(+value / 100)
              } else {
                valueToDisplay = value
              }

              return (
                <BoxWrapperRow key={index} gap={2} sx={{ justifyContent: 'flex-start' }}>
                  <CustomTypography
                    variant={'body2'}
                    sx={{
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      '-webkit-line-clamp': 4,
                      '-webkit-box-orient': 'vertical'
                    }}
                  >
                    {label + ':'}
                  </CustomTypography>
                  <CustomTypography
                    variant={'body2'}
                    sx={{
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden'
                    }}
                  >
                    {valueToDisplay}
                  </CustomTypography>
                </BoxWrapperRow>
              )
            })}
          </BoxWrapperColumn>
        </AccordionDetails>
      </AccordionWrapper>
    </BoxWrapperRow>
  )
}
