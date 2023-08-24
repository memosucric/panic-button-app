import PositionName from 'src/views/Positions/PositionName'
import ProtocolIcon from 'src/views/Positions/ProtocolIcon'
import Title from 'src/views/Positions/Title'
import BoxWrapperColumn from 'src/components/Wrappers/BoxWrapperColumn'
import BoxWrapperRow from 'src/components/Wrappers/BoxWrapperRow'
import * as React from 'react'
import { PositionType } from 'src/contexts/types'
import Link from 'next/link'

interface PositionProps {
  id: number
  position: PositionType
}

const Position = (props: PositionProps) => {
  const { position } = props
  const { position_id, protocol, blockchain, lptoken_name: positionName } = position

  return (
    <Link href={`/positions/${position_id}`} style={{ textDecoration: 'none' }}>
      <BoxWrapperColumn
        gap={4}
        sx={{
          padding: '10px',
          cursor: 'pointer',
          width: '100%',
          height: '100%',
          justifyContent: 'space-between'
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
    </Link>
  )
}

export default Position
