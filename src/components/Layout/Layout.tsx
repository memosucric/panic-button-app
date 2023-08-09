import Footer, { FOOTER_HEIGHT } from 'src/components/Layout/Footer'
import React, { ReactElement } from 'react'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import Header, { HEADER_HEIGHT } from 'src/components/Layout/Header'

interface LayoutProps {
  children: React.ReactElement
}

const LayoutWrapper = styled(Box)(() => ({
  display: 'grid',
  gap: '0px 0px',
  minHeight: '100vh',
  gridTemplateRows: `${HEADER_HEIGHT}px auto ${FOOTER_HEIGHT}px`,
  gridTemplateColumns: `auto`,
  gridTemplateAreas: `"header"
                      "body"
                      "footer"`
}))

const Layout = ({ children }: LayoutProps): ReactElement => {
  return (
    <LayoutWrapper>
      <Box
        sx={{
          gridArea: 'header',
          width: '100%',
          position: 'fixed',
          top: 0,
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          zIndex: 1000,
          minHeight: HEADER_HEIGHT
        }}
      >
        <Header />
      </Box>
      <Box
        sx={{
          gridArea: 'body',
          width: '100%',
          minHeight: '100%',
          zIndex: 900,
          overflowX: 'hidden',
          overflowY: 'hidden'
        }}
      >
        {children}
      </Box>
      <Box sx={{ gridArea: 'footer', width: '100%' }}>
        <Footer />
      </Box>
    </LayoutWrapper>
  )
}

export default Layout
