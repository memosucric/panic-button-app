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
  const { positions } = props
  const { dispatch, state } = useApp()
  const { values } = state.positions

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
  }, [positions, dispatch, status])

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
  const { user } = (await getSession(req as any, res as any)) as Session

  if (!user) {
    return {
      props: {
        positions: []
      }
    }
  }

  const dataWarehouse = DataWarehouse.getInstance()

  const allPositions: PositionType[] = await dataWarehouse.getPositions()

  const [role] = user['http://localhost:3000/roles']

  const positions = allPositions.filter((position) => role && position.dao === role)

  return { props: { positions } }
}
