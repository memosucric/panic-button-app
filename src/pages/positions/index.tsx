import PageLayout from 'src/components/Layout/Layout'
import * as React from 'react'
import { ReactElement } from 'react'
import WrapperPositions from 'src/views/Positions/WrapperPositions'
import { useApp } from 'src/contexts/app.context'
import { PositionType, Types } from 'src/contexts/types'
import { DataWarehouse } from 'src/services/classes/dataWarehouse.class'

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

export default PositionsPage

export async function getServerSideProps() {
  const dataWarehouse = DataWarehouse.getInstance()

  const positions = await dataWarehouse.getPositions()

  return { props: { positions } }
}
