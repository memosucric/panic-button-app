import CustomTypography from 'src/components/CustomTypography'
import BoxWrapperColumn from 'src/components/Wrappers/BoxWrapperColumn'
import BoxWrapperRow from 'src/components/Wrappers/BoxWrapperRow'
import InfoIcon from '@mui/icons-material/Info'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'

interface InfoCardProps {
  title: string
  value: string
  helpInfo?: string
}

const InfoCard = ({ title, value, helpInfo }: InfoCardProps) => {
  return (
    <BoxWrapperColumn
      sx={{
        minWidth: 'max-content',
        width: 'max-content',
        gap: 2
      }}
    >
      <BoxWrapperRow gap={2} sx={{ justifyContent: 'flex-start', alignItems: 'flex-end' }}>
        <CustomTypography variant={'infoCardTitle'}>{title}</CustomTypography>
        {helpInfo ? (
          <Tooltip
            title={
              <CustomTypography variant="body2" sx={{ color: 'common.white' }}>
                {helpInfo}
              </CustomTypography>
            }
            sx={{ ml: 1, cursor: 'pointer' }}
          >
            <InfoIcon sx={{ fontSize: 24, cursor: 'pointer' }} />
          </Tooltip>
        ) : null}
      </BoxWrapperRow>
      <CustomTypography variant={'infoCardValue'}>{value}</CustomTypography>
    </BoxWrapperColumn>
  )
}

export default InfoCard
