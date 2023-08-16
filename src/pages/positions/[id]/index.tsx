import * as React from 'react'
import { ReactElement } from 'react'
import PageLayout from 'src/components/Layout/Layout'
import { useApp } from 'src/contexts/app.context'
import { DataWarehouse } from 'src/services/classes/dataWarehouse.class'
import { PositionType, Types } from 'src/contexts/types'
import BoxContainerWrapper from 'src/components/Wrappers/BoxContainerWrapper'
import PositionDetail from 'src/views/Position/WrappedPosition'

interface PositionIndexProps {
  positionId: string
  position: PositionType
}

const Index = (props: PositionIndexProps): ReactElement => {
  const { position } = props

  const { dispatch } = useApp()

  React.useEffect(() => {
    dispatch({
      type: Types.UpdateStatus,
      payload: 'loading'
    })

    dispatch({
      type: Types.UpdatePositionSelected,
      payload: position
    })

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

Index.getTitle = 'Position'

Index.getLayout = (page: ReactElement) => <PageLayout>{page}</PageLayout>

export default Index

export async function getServerSideProps(ctx: any) {
  const { params: { id = '' } = {} } = ctx
  const dataWarehouse = DataWarehouse.getInstance()

  const position = (await dataWarehouse.getPositionById(id))?.[0]

  return {
    props: {
      positionId: id,
      position
    }
  }
}
