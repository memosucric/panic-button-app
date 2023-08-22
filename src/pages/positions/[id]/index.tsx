import * as React from 'react'
import { ReactElement } from 'react'
import PageLayout from 'src/components/Layout/Layout'
import { useApp } from 'src/contexts/app.context'
import { DataWarehouse } from 'src/services/classes/dataWarehouse.class'
import { PositionType, Types } from 'src/contexts/types'
import BoxContainerWrapper from 'src/components/Wrappers/BoxContainerWrapper'
import PositionDetail from 'src/views/Position/WrappedPosition'
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import { getSession, Session } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'

interface PositionIndexProps {
  positionId: Maybe<string>
  position: Maybe<PositionType>
}

const PositionIndex = (props: PositionIndexProps): ReactElement => {
  const { position } = props

  const { dispatch } = useApp()

  React.useEffect(() => {
    dispatch({
      type: Types.UpdateStatus,
      payload: 'loading'
    })
    if (!position) {
      dispatch({
        type: Types.ClearPositionSelected,
        payload: null
      })
    } else {
      dispatch({
        type: Types.UpdatePositionSelected,
        payload: position
      })
    }

    dispatch({
      type: Types.UpdateStatus,
      payload: 'idle'
    })
  }, [position, dispatch])

  return (
    <BoxContainerWrapper>
      <PositionDetail />
    </BoxContainerWrapper>
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
