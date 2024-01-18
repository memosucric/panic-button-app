import ErrorBoundaryWrapper from 'src/components/ErrorBoundary/ErrorBoundaryWrapper'
import React from 'react'
import PaperSection from 'src/components/PaperSection'
import { useApp } from 'src/contexts/app.context'
import List from 'src/views/Positions/List'
import EmptyData from 'src/components/EmptyData'
import BoxContainerWrapper from 'src/components/Wrappers/BoxContainerWrapper'
import Loading from 'src/components/Loading'
import { TextField, IconButton } from '@mui/material'
import { SearchOutlined } from '@mui/icons-material'
import { Position, Status } from 'src/contexts/state'
import { HEADER_HEIGHT } from 'src/components/Layout/Header'
import { FOOTER_HEIGHT } from 'src/components/Layout/Footer'
import { BLOCKCHAIN, DAO, EXECUTION_TYPE, getDAOFilePath } from 'src/config/strategies/manager'
import { getStrategy } from 'src/utils/strategies'

interface SearchPositionProps {
  onChange: (value: string) => void
}

const SearchPosition = (props: SearchPositionProps) => {
  return (
    <TextField
      size="small"
      sx={{ width: '600px' }}
      variant="outlined"
      onChange={(e) => props.onChange(e.target.value)}
      placeholder="Search position"
      InputProps={{
        endAdornment: (
          <IconButton>
            <SearchOutlined />
          </IconButton>
        )
      }}
    />
  )
}

const WrapperPositions = () => {
  const { state } = useApp()
  const { positions, status } = state

  const [value, setValue] = React.useState('')
  const [filteredPositions, setFilteredPositions] = React.useState(positions)

  React.useEffect(() => {
    setFilteredPositions(positions)
  }, [positions])

  const onChange = React.useCallback(
    (value: string) => {
      setValue(value)

      const filtered = positions.filter((position: Position) => {
        if (value === '') return true
        return (
          position.lptoken_name.toLowerCase().includes(value.toLowerCase()) ||
          position.protocol.toLowerCase().includes(value.toLowerCase()) ||
          position.lptoken_address.toLowerCase().includes(value.toLowerCase())
        )
      })
      setFilteredPositions(filtered)
    },
    [positions]
  )

  const filteredPositionsActive = filteredPositions
    .map((position: Position) => {
      const existDAOFilePath = !!getDAOFilePath(
        position.dao as DAO,
        position.blockchain as BLOCKCHAIN,
        'execute' as EXECUTION_TYPE
      )
      const { positionConfig } = getStrategy(position as Position)
      const areAnyStrategies = positionConfig?.length > 0
      const isActive = areAnyStrategies && existDAOFilePath
      return {
        ...position,
        isActive
      }
    })
    .sort((a: Position, b: Position) => {
      if (a.isActive && !b.isActive) return -1
      if (!a.isActive && b.isActive) return 1
      if (a.lptoken_name < b.lptoken_name) return -1
      if (a.lptoken_name > b.lptoken_name) return 1
      return 0
    })

  return (
    <ErrorBoundaryWrapper>
      <BoxContainerWrapper>
        {status === Status.Loading ? (
          <Loading minHeight={`calc(100vh - ${HEADER_HEIGHT}px - ${FOOTER_HEIGHT}px)`} />
        ) : null}
        {status === Status.Finished ? (
          <PaperSection title="Positions">
            <SearchPosition onChange={onChange} />
            {filteredPositionsActive?.length > 0 ? (
              <List positions={filteredPositionsActive} />
            ) : null}
            {(filteredPositionsActive?.length === 0 && value !== '') || positions?.length === 0 ? (
              <EmptyData />
            ) : null}
          </PaperSection>
        ) : null}
      </BoxContainerWrapper>
    </ErrorBoundaryWrapper>
  )
}

export default WrapperPositions
