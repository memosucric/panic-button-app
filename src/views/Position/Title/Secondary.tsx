import BoxWrapperRow from 'src/components/Wrappers/BoxWrapperRow'
import CustomTypography from 'src/components/CustomTypography'
import * as React from 'react'

interface TitleSecondaryProps {
  title: string
  subtitle?: string
}

const Secondary = ({ title, subtitle }: TitleSecondaryProps) => {
  return (
    <BoxWrapperRow gap={2} sx={{ justifyContent: 'flex-start' }}>
      <CustomTypography
        sx={{
          fontWeight: 500,
          fontFamily: 'IBM Plex Sans',
          fontStyle: 'normal',
          fontSize: 18,
          lineHeight: '18px',
          color: 'custom.grey.dark'
        }}
      >
        {title}
      </CustomTypography>
      {subtitle ? (
        <CustomTypography
          sx={{
            fontWeight: 700,
            fontFamily: 'IBM Plex Sans',
            fontStyle: 'normal',
            fontSize: 18,
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

export default Secondary
