import Footer, { FOOTER_HEIGHT } from 'src/components/Layout/Footer'
import React, { ReactElement } from 'react'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import Header, { HEADER_HEIGHT } from 'src/components/Layout/Header'
import Body from 'src/components/Layout/Body'

interface LayoutProps {
  children: React.ReactElement
}

const LayoutWithoutSidebarWrapper = styled(Box)(() => ({
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
    <LayoutWithoutSidebarWrapper>
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
          top: HEADER_HEIGHT,
          zIndex: 900,
          overflowX: 'hidden',
          overflowY: 'hidden'
        }}
      >
        <Body>{children}</Body>
      </Box>
      <Box sx={{ gridArea: 'footer', width: '100%' }}>
        <Footer />
      </Box>
    </LayoutWithoutSidebarWrapper>
  )
}

export default Layout
