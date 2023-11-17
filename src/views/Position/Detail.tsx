import BoxWrapperColumn from 'src/components/Wrappers/BoxWrapperColumn'
import * as React from 'react'
import { PositionType } from 'src/contexts/types'
import { Divider } from '@mui/material'
import {
  DAO,
  getStrategyByPositionId,
  BLOCKCHAIN,
  ExecConfig,
  getDAOFilePath
} from 'src/config/strategies/manager'
import Form from 'src/views/Position/Form/Form'
import Primary from 'src/views/Position/Title/Primary'
import Secondary from 'src/views/Position/Title/Secondary'
import NoStrategies from 'src/views/Position/NoStrategies'

interface DetailProps {
  position: PositionType
}

const Detail = (props: DetailProps) => {
  const { position } = props

  const {
    dao,
    position_id: positionId,
    protocol,
    blockchain,
    lptoken_name: positionName
  } = position

  const config: ExecConfig = getStrategyByPositionId(
    dao as DAO,
    blockchain as unknown as BLOCKCHAIN,
    protocol,
    positionId
  )
  const { positionConfig } = config
  const existDAOFilePath = !!getDAOFilePath(position.dao as DAO, blockchain as BLOCKCHAIN)
  const areAnyStrategies = positionConfig?.length > 0

  return (
    <BoxWrapperColumn
      gap={6}
      sx={{
        justifyContent: 'center',
        marginTop: '20px',
        border: '1px solid #B6B6B6',
        backgroundColor: 'custom.grey.light',
        borderRadius: '8px',
        padding: '30px 30px',
        width: '400px'
      }}
    >
      <BoxWrapperColumn gap={2}>
        <BoxWrapperColumn gap={1}>
          <Primary title={'Overview'} />
          <Divider sx={{ borderBottomWidth: 5 }} />
        </BoxWrapperColumn>
        <BoxWrapperColumn gap={2}>
          <Secondary title={`Blockchain:`} subtitle={blockchain} />
          <Secondary title={`Protocol:`} subtitle={protocol} />
          <Secondary title={`Position:`} subtitle={positionName} />
        </BoxWrapperColumn>
      </BoxWrapperColumn>
      <BoxWrapperColumn gap={2}>
        {areAnyStrategies && existDAOFilePath ? (
          <Form config={config} position={position} />
        ) : (
          <NoStrategies />
        )}
      </BoxWrapperColumn>
    </BoxWrapperColumn>
  )
}

export default Detail
