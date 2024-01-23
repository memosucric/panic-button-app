import LogoKarpatkey from 'src/components/LogoKarpatkey'
import BoxWrapperRow from 'src/components/Wrappers/BoxWrapperRow'
import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { Avatar, Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import CustomTypography from 'src/components/CustomTypography'
import useMediaQuery from '@mui/material/useMediaQuery'

export const HEADER_HEIGHT = 100

const NotLoggedComponent = () => {
  const { push } = useRouter()

  const onLogin = () => {
    push('/api/auth/login')
  }
  return (
    <Button onClick={onLogin} sx={{ gap: 2, height: '48px', padding: '6px 14px' }}>
      Login
    </Button>
  )
}

interface LoggedComponentProps {
  name: string
  image: string
}

const LoggedComponent = (props: LoggedComponentProps) => {
  const { name, image } = props
  const { push } = useRouter()

  const matches = useMediaQuery((theme: any) => theme.breakpoints.up('sm'))

  const onLogout = () => {
    push('/api/auth/logout')
  }
  return (
    <BoxWrapperRow>
      <BoxWrapperRow>
        {matches && <Avatar alt={name} src={image} />}
        <CustomTypography
          ellipsis={true}
          sx={{
            gap: 2,
            maxWidth: 'min-content',
            padding: '6px 14px',
            alignItems: 'center'
          }}
        >
          {name}
        </CustomTypography>
      </BoxWrapperRow>
      <Button onClick={onLogout} sx={{ gap: 2, height: '48px', padding: '6px 14px' }}>
        Logout
      </Button>
    </BoxWrapperRow>
  )
}

const Header = () => {
  const { user, isLoading } = useUser()

  const name = user?.name ?? ''
  const image = user?.picture ?? ''

  const loggedComponentProps = {
    name,
    image
  }

  return (
    <BoxWrapperRow
      sx={{
        backgroundColor: 'background.default',
        justifyContent: 'space-between',
        paddingX: '26px',
        paddingRight: '48px',
        paddingLeft: '48px',
        height: HEADER_HEIGHT
      }}
    >
      <LogoKarpatkey />
      <BoxWrapperRow>
        {!isLoading ? (
          !user ? (
            <NotLoggedComponent />
          ) : (
            <LoggedComponent {...loggedComponentProps} />
          )
        ) : null}
      </BoxWrapperRow>
    </BoxWrapperRow>
  )
}

export default Header
