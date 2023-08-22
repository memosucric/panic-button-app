import PageLayout from 'src/components/Layout/Layout'
import * as React from 'react'
import { ReactElement } from 'react'
import WrapperPositions from 'src/views/Positions/WrapperPositions'
import { useApp } from 'src/contexts/app.context'
import { PositionType, Types } from 'src/contexts/types'
import { DataWarehouse } from 'src/services/classes/dataWarehouse.class'
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import { getSession, Session } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'

interface PositionsPageProps {
  positions: PositionType[]
}

const PositionsPage = (props: PositionsPageProps): ReactElement => {
  const { positions = [] } = props
  const { dispatch, state } = useApp()
  const values = state.positions.values

  React.useEffect(() => {
    if (values.length > 0) return

    dispatch({
      type: Types.UpdateStatus,
      payload: 'loading'
    })

    dispatch({
      type: Types.BulkPositions,
      payload: positions
    })

    dispatch({
      type: Types.UpdateStatus,
      payload: 'idle'
    })
  }, [dispatch, positions])

  return <WrapperPositions />
}

PositionsPage.getTitle = 'Home'

PositionsPage.getLayout = (page: ReactElement) => <PageLayout>{page}</PageLayout>

export default withPageAuthRequired(PositionsPage)

export const getServerSideProps = async (context: {
  req: NextApiRequest
  res: NextApiResponse
}) => {
  const { req, res } = context
  const session = await getSession(req as any, res as any)

  if (!session) {
    return {
      props: {
        positions: []
      }
    }
  }

  const user = (session as Session).user
  const roles = user?.['http://localhost:3000/roles']
    ? (user?.['http://localhost:3000/roles'] as unknown as string[])
    : ['']
  const dao = roles?.[0] ?? ''

  const dataWarehouse = DataWarehouse.getInstance()

  const allPositions: PositionType[] = await dataWarehouse.getPositions()

  const positions = allPositions.filter((position) => dao && position.dao === dao)

  return { props: { positions } }
}
