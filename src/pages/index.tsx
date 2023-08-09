import PageLayout from 'src/components/Layout/Layout'
import * as React from 'react'
import { ReactElement } from 'react'
import Cache from 'src/services/classes/cache.class'
import Positions from 'src/views/Positions'
import { getTokenDetailByPosition } from 'src/utils/dataWareHouse'
import { useApp } from 'src/contexts/app.context'
import { PositionType, Types } from 'src/contexts/types'

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

  return <Positions />
}

Homepage.getTitle = 'Home'

Homepage.getLayout = (page: ReactElement) => <PageLayout>{page}</PageLayout>

export default Homepage

export async function getServerSideProps() {
  const cache = Cache.getInstance()
  const dataPositions = await cache.getReport('getFinancialMetricAndVarDetail' as unknown as Report)

  const YEAR = '2023'
  const MONTH = '7'
  const DATE_TYPE = 'month'

  const dataPositionsFiltered = dataPositions.filter((row: any) => {
    return row.date_type === DATE_TYPE && row.year_month === `${YEAR}_${MONTH}`
  })

  const positions = getTokenDetailByPosition(dataPositionsFiltered)

  return { props: { positions } }
}
