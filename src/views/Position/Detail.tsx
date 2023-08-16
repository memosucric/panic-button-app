import BoxWrapperColumn from 'src/components/Wrappers/BoxWrapperColumn'
import * as React from 'react'
import { PositionType } from 'src/contexts/types'
import CustomTypography from 'src/components/CustomTypography'
import BoxWrapperRow from 'src/components/Wrappers/BoxWrapperRow'
import { Divider } from '@mui/material'
import ItemText from 'src/views/Common/ItemText'

interface DetailProps {
  selectedValue: PositionType
}

interface TitleRowProps {
  title: string
  subtitle?: string
}

const TitleRow = ({ title, subtitle }: TitleRowProps) => {
  return (
    <BoxWrapperRow gap={2} sx={{ justifyContent: 'flex-start' }}>
      <CustomTypography
        sx={{
          fontFamily: 'IBM Plex Sans',
          fontStyle: 'normal',
          fontWeight: 500,
          fontSize: 20,
          lineHeight: '18px',
          color: 'custom.grey.dark'
        }}
      >
        {title}
      </CustomTypography>
      {subtitle ? (
        <CustomTypography
          sx={{
            fontFamily: 'IBM Plex Sans',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: 20,
            lineHeight: '18px',
            color: 'custom.grey.dark'
          }}
        >
          {subtitle}
        </CustomTypography>
      ) : null}
    </BoxWrapperRow>
  )
}

const Detail = (props: DetailProps) => {
  const { selectedValue } = props

  const { protocol, blockchain, lptoken_name: positionName } = selectedValue

  return (
    <BoxWrapperColumn
      gap={6}
      sx={{
        justifyContent: 'center',
        marginTop: '20px',
        border: '1px solid #B6B6B6',
        backgroundColor: 'custom.grey.light',
        borderRadius: '8px',
        padding: '30px 30px',
        width: '400px'
      }}
    >
      <BoxWrapperColumn gap={4}>
        <BoxWrapperColumn gap={1}>
          <ItemText itemText={'Information'} />
          <Divider sx={{ borderBottomWidth: 5 }} />
        </BoxWrapperColumn>

        <TitleRow title={`Blockchain:`} subtitle={blockchain} />
        <TitleRow title={`Protocol:`} subtitle={protocol} />
        <TitleRow title={`Position:`} subtitle={positionName} />
      </BoxWrapperColumn>
      <BoxWrapperColumn gap={4}>
        <BoxWrapperColumn gap={1}>
          <ItemText itemText={'Strategies'} />
          <Divider sx={{ borderBottomWidth: 5 }} />
        </BoxWrapperColumn>
      </BoxWrapperColumn>
    </BoxWrapperColumn>
  )
}

export default Detail
