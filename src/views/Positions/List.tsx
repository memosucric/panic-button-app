import { Box } from '@mui/material'
import * as React from 'react'
import Card from 'src/views/Positions/Card'
import { Position } from 'src/contexts/state'

interface ListProps {
  positions: Position[]
}

const List = (props: ListProps) => {
  const { positions } = props

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '20px 20px'
      }}
    >
      {positions.map((position: Position, index: number) => {
        return (
          <Box
            key={index}
            sx={{
              width: '280px',
              minHeight: '140px',
              maxHeight: '200px',
              padding: '12px 12px',
              border: '1px solid #B6B6B6',
              background: 'background.paper',
              borderRadius: '8px'
            }}
          >
            <Card id={index} key={index} position={position} />
          </Box>
        )
      })}
    </Box>
  )
}

export default List
