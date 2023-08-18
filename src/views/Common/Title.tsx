import CustomTypography from 'src/components/CustomTypography'
import * as React from 'react'

interface TitleProps {
  title: string
  fontSize?: number
}

const Title = ({ title, fontSize = 14 }: TitleProps) => {
  return (
    <CustomTypography
      sx={{
        fontFamily: 'IBM Plex Sans',
        fontStyle: 'normal',
        fontWeight: 700,
        fontSize,
        lineHeight: '18px',
        color: 'custom.grey.dark'
      }}
    >
      {title}
    </CustomTypography>
  )
}

export default Title
