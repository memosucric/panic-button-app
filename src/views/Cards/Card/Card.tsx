import { formatCurrency } from 'src/utils/format'
import ItemText from 'src/views/Cards/Card/ItemText'
import Position from 'src/views/Cards/Card/Position'
import ProtocolIcon from 'src/views/Cards/Card/ProtocolIcon'
import Title from 'src/views/Cards/Card/Title'
import BoxWrapperColumn from 'src/components/Wrappers/BoxWrapperColumn'
import BoxWrapperRow from 'src/components/Wrappers/BoxWrapperRow'
import * as React from 'react'

interface CardItemProps {
  id: number
  card: any
}

const Card = (props: CardItemProps) => {
  const { card } = props
  const { blockchain, dao, protocol, position, totalUsdValue } = card

  return (
    <BoxWrapperColumn gap={4} sx={{ padding: '10px', cursor: 'pointer' }}>
      <BoxWrapperRow sx={{ justifyContent: 'space-between' }}>
        <BoxWrapperColumn gap={1}>
          <Title title={dao} />
          <Title title={blockchain} />
        </BoxWrapperColumn>
        <BoxWrapperRow gap={1}>
          <ProtocolIcon protocol={protocol} />
          <Title title={protocol} />
        </BoxWrapperRow>
      </BoxWrapperRow>
      <BoxWrapperColumn gap={1}>
        <Position position={position} />
        <ItemText maxWidth={'fit-content'} itemText={formatCurrency(totalUsdValue || 0, 2)} />
      </BoxWrapperColumn>
    </BoxWrapperColumn>
  )
}

export default Card
