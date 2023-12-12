import PageLayout from 'src/components/Layout/Layout'
import * as React from 'react'
import { ReactElement } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import BoxContainerWrapper from 'src/components/Wrappers/BoxContainerWrapper'
import CustomTypography from 'src/components/CustomTypography'
import Loading from 'src/components/Loading'
import { useRouter } from 'next/navigation'
import { HEADER_HEIGHT } from 'src/components/Layout/Header'
import { FOOTER_HEIGHT } from 'src/components/Layout/Footer'

const Homepage = (): ReactElement => {
  const { user, error, isLoading } = useUser()
  const { push } = useRouter()

  if (isLoading) return <Loading minHeight={`calc(100vh - ${HEADER_HEIGHT}px - ${FOOTER_HEIGHT}px)`} />
  if (error) push('/500')
  if (!user) {
    return (
      <BoxContainerWrapper>
        <CustomTypography
          variant="h3"
          sx={{
            display: 'flex',
            minHeight: `calc(100vh - ${HEADER_HEIGHT}px - ${FOOTER_HEIGHT}px)`,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          To view the positions you need to Login
        </CustomTypography>
      </BoxContainerWrapper>
    )
  }

  push('/positions')
  return <></>
}

Homepage.getTitle = 'Home'

Homepage.getLayout = (page: ReactElement) => <PageLayout>{page}</PageLayout>

export default Homepage
