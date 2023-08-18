import LogoKarpatkey from 'src/components/LogoKarpatkey'
import BoxWrapperRow from 'src/components/Wrappers/BoxWrapperRow'
import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { Avatar, Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import CustomTypography from 'src/components/CustomTypography'

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

  const onLogout = () => {
    push('/api/auth/logout')
  }
  return (
    <BoxWrapperRow gap={4}>
      <BoxWrapperRow>
        <Avatar alt={name} src={image} />
        <CustomTypography
          sx={{
            gap: 2,
            height: '48px',
            padding: '6px 14px',
            alignItems: 'center',
            display: 'flex'
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
            <LoggedComponent name={user?.name ?? ''} image={user?.picture ?? ''} />
          )
        ) : null}
      </BoxWrapperRow>
    </BoxWrapperRow>
  )
}

export default Header
