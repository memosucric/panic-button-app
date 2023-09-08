import BoxWrapperColumn from 'src/components/Wrappers/BoxWrapperColumn'
import * as React from 'react'
import { PositionType } from 'src/contexts/types'
import { Divider } from '@mui/material'
import { getStrategies, DAO, StrategyContent, ExecConfig } from 'src/config/strategiesManager'
import Form from 'src/views/Position/Form'
import Primary from 'src/views/Position/Title/Primary'
import Secondary from 'src/views/Position/Title/Secondary'
import NoStrategies from 'src/views/Position/NoStrategies'

interface DetailProps {
  selectedValue: PositionType
}

const Detail = (props: DetailProps) => {
  const { selectedValue } = props

  const { protocol, blockchain, lptoken_name: positionName } = selectedValue

  const strategyContent: StrategyContent = getStrategies(selectedValue.dao as DAO)

  const positionId = `${selectedValue.lptoken_name}_${selectedValue.position_id}`
  const position = strategyContent?.positions.find(
    (position) => position.position_id === positionId
  )

  const strategies: ExecConfig[] = position?.exec_config ?? []

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
          <Primary title={'Information'} />
          <Divider sx={{ borderBottomWidth: 5 }} />
        </BoxWrapperColumn>
        <BoxWrapperColumn gap={2}>
          <Secondary title={`Blockchain:`} subtitle={blockchain} />
          <Secondary title={`Protocol:`} subtitle={protocol} />
          <Secondary title={`Position:`} subtitle={positionName} />
        </BoxWrapperColumn>
      </BoxWrapperColumn>
      <BoxWrapperColumn gap={2}>
        {strategies ? <Form strategies={strategies} /> : <NoStrategies />}
      </BoxWrapperColumn>
    </BoxWrapperColumn>
  )
}

export default Detail
