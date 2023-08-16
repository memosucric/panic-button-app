import PageLayout from 'src/components/Layout/Layout'
import * as React from 'react'
import { ReactElement } from 'react'
import WrapperPositions from 'src/views/Positions/WrapperPositions'
import { useApp } from 'src/contexts/app.context'
import { PositionType, Types } from 'src/contexts/types'
import { DataWarehouse } from 'src/services/classes/dataWarehouse.class'

interface HomepageProps {
  positions: PositionType[]
}

const Homepage = (props: HomepageProps): ReactElement => {
  const { positions } = props
  const { dispatch } = useApp()

  React.useEffect(() => {
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
  }, [positions, dispatch])

  return <WrapperPositions />
}

Homepage.getTitle = 'Home'

Homepage.getLayout = (page: ReactElement) => <PageLayout>{page}</PageLayout>

export default Homepage

export async function getServerSideProps() {
  const dataWarehouse = DataWarehouse.getInstance()

  // Step 2: Query the data
  const positions = await dataWarehouse.getPositions()

  return { props: { positions } }
}
