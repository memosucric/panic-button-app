import PositionName from 'src/views/Positions/PositionName'
import ProtocolIcon from 'src/views/Positions/ProtocolIcon'
import Title from 'src/views/Positions/Title'
import BoxWrapperColumn from 'src/components/Wrappers/BoxWrapperColumn'
import BoxWrapperRow from 'src/components/Wrappers/BoxWrapperRow'
import * as React from 'react'
import { PositionType } from 'src/contexts/types'
import Link from 'next/link'
import {
  BLOCKCHAIN,
  DAO,
  getDAOFilePath,
  getStrategyByPositionId
} from 'src/config/strategies/manager'

interface PositionProps {
  id: number
  position: PositionType
}

const Card = (props: PositionProps) => {
  const { position } = props
  const { position_id: positionId, protocol, blockchain, lptoken_name: positionName } = position

  const existDAOFilePath = !!getDAOFilePath(position.dao as DAO, blockchain as BLOCKCHAIN)

  const config = getStrategyByPositionId(
    position.dao as DAO,
    blockchain as BLOCKCHAIN,
    protocol,
    positionId
  )
  const { positionConfig } = config
  const areAnyStrategies = positionConfig?.length > 0

  const CardWrapper = () => {
    return (
      <BoxWrapperColumn
        gap={4}
        sx={{
          padding: '10px',
          width: '100%',
          height: '100%',
          justifyContent: 'space-between',
          ...(areAnyStrategies && existDAOFilePath ? { cursor: 'pointer' } : {}),
          ...(!areAnyStrategies || !existDAOFilePath ? { opacity: '0.2 !important' } : {})
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

  return areAnyStrategies ? (
    <Link href={`/positions/${positionId}`} style={{ textDecoration: 'none' }}>
      <CardWrapper />
    </Link>
  ) : (
    <CardWrapper />
  )
}

export default Card
