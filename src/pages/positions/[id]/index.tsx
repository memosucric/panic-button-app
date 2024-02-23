import * as React from 'react'
import { ReactElement } from 'react'
import PageLayout from 'src/components/Layout/Layout'
import { useApp } from 'src/contexts/app.context'
import { DataWarehouse } from 'src/services/classes/dataWarehouse.class'
import BoxContainerWrapper from 'src/components/Wrappers/BoxContainerWrapper'
import PositionDetail from 'src/views/Position/WrappedPosition'
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import { getSession, Session } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import { clearSelectedPosition, setSelectedPosition, updateStatus } from 'src/contexts/reducers'
import { Position, Status } from 'src/contexts/state'
import Loading from 'src/components/Loading'
import { HEADER_HEIGHT } from 'src/components/Layout/Header'
import { FOOTER_HEIGHT } from 'src/components/Layout/Footer'
import CustomTypography from 'src/components/CustomTypography'

interface PositionIndexProps {
  positionId: Maybe<string>
  position: Maybe<Position>
}

const PositionDoesntExist = () => {
  return (
    <BoxContainerWrapper>
      <CustomTypography variant="h3" align="center" style={{ marginTop: '35vh' }}>
        Position doesn't exist, please try again.
      </CustomTypography>
    </BoxContainerWrapper>
  )
}

const PositionIndex = (props: PositionIndexProps): ReactElement => {
  const { position } = props

  const { dispatch, state } = useApp()
  const { status } = state

  React.useEffect(() => {
    dispatch(updateStatus('Loading' as Status))
    if (!position) {
      dispatch(clearSelectedPosition())
    } else {
      dispatch(setSelectedPosition(position))
    }

    dispatch(updateStatus('Finished' as Status))
  }, [position, dispatch])

  return (
    <>
      {status === 'Loading' && (
        <Loading minHeight={`calc(100vh - ${HEADER_HEIGHT}px - ${FOOTER_HEIGHT}px)`} />
      )}
      {status === 'Finished' && position && (
        <BoxContainerWrapper>
          <PositionDetail />
        </BoxContainerWrapper>
      )}
      {status === 'Finished' && !position && <PositionDoesntExist />}
    </>
  )
}

PositionIndex.getTitle = 'Position'

PositionIndex.getLayout = (page: ReactElement) => <PageLayout>{page}</PageLayout>

export default withPageAuthRequired(PositionIndex)

const getServerSideProps = async (context: {
  req: NextApiRequest
  res: NextApiResponse
  params: { id: string }
}) => {
  const { req, res, params: { id = '' } = {} } = context
  const session = await getSession(req as any, res as any)

  if (!session) {
    return {
      props: {
        positionId: null,
        position: null
      }
    }
  }

  const user = (session as Session).user
  const roles = user?.['http://localhost:3000/roles']
    ? (user?.['http://localhost:3000/roles'] as unknown as string[])
    : ['']
  const dao = roles?.[0] ?? ''

  const dataWarehouse = DataWarehouse.getInstance()
  const positionDW = (await dataWarehouse.getPositionById(id))?.[0]

  const position = positionDW && positionDW.dao === dao ? positionDW : null

  return {
    props: {
      positionId: id,
      position
    }
  }
}

export { getServerSideProps }
