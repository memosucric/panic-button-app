import PositionName from 'src/views/Positions/PositionName'
import ProtocolIcon from 'src/views/Positions/ProtocolIcon'
import Title from 'src/views/Positions/Title'
import BoxWrapperColumn from 'src/components/Wrappers/BoxWrapperColumn'
import BoxWrapperRow from 'src/components/Wrappers/BoxWrapperRow'
import * as React from 'react'
import { PositionType } from 'src/contexts/types'
import Link from 'next/link'
import { DAO, ExecConfig, getStrategies, StrategyContent } from 'src/config/strategiesManager'

interface PositionProps {
  id: number
  position: PositionType
}

const Position = (props: PositionProps) => {
  const { position } = props
  const { position_id, protocol, blockchain, lptoken_name: positionName } = position

  const strategyContent: StrategyContent = getStrategies(position.dao as DAO)

  const positionId = `${positionName}_${position_id}`
  const positionFound = strategyContent?.positions.find(
    (position) => position.position_id === positionId
  )

  const strategies: ExecConfig[] = positionFound?.exec_config ?? []

  const PositionWrapper = () => {
    return (
      <BoxWrapperColumn
        gap={4}
        sx={{
          padding: '10px',
          ...(strategies.length > 0 ? { cursor: 'pointer' } : {}),
          width: '100%',
          height: '100%',
          justifyContent: 'space-between',
          ...(strategies.length === 0 ? { opacity: '0.2 !important' } : {})
        }}
      >
        <BoxWrapperRow sx={{ justifyContent: 'space-between' }}>
          <Title title={blockchain} />
          <BoxWrapperRow gap={1}>
            <ProtocolIcon protocol={protocol} />
            <Title title={protocol} />
          </BoxWrapperRow>
        </BoxWrapperRow>
        <BoxWrapperColumn gap={1}>
          <PositionName position={positionName} />
        </BoxWrapperColumn>
      </BoxWrapperColumn>
    )
  }

  return strategies.length > 0 ? (
    <Link href={`/positions/${position_id}`} style={{ textDecoration: 'none' }}>
      <PositionWrapper />
    </Link>
  ) : (
    <PositionWrapper />
  )
}

export default Position
