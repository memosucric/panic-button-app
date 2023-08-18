import BoxWrapperColumn from 'src/components/Wrappers/BoxWrapperColumn'
import CustomTypography from 'src/components/CustomTypography'
import * as React from 'react'

const NoStrategies = () => {
  return (
    <BoxWrapperColumn gap={2} sx={{ justifyContent: 'flex-start' }}>
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
        No strategies found
      </CustomTypography>
    </BoxWrapperColumn>
  )
}

export default NoStrategies
