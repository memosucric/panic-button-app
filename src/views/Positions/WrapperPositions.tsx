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
import { PositionType } from 'src/contexts/types'

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
  const { positions } = state
  const { values, status } = positions

  const [value, setValue] = React.useState('')
  const [filteredPositions, setFilteredPositions] = React.useState(values)

  React.useEffect(() => {
    setFilteredPositions(values)
  }, [values])

  const onChange = React.useCallback(
    (value: string) => {
      setValue(value)

      const filtered = values.filter((position: PositionType) => {
        if (value === '') return true
        return (
          position.lptoken_name.toLowerCase().includes(value.toLowerCase()) ||
          position.protocol.toLowerCase().includes(value.toLowerCase()) ||
          position.lptoken_address.toLowerCase().includes(value.toLowerCase())
        )
      })
      setFilteredPositions(filtered)
    },
    [values]
  )

  return (
    <ErrorBoundaryWrapper>
      <BoxContainerWrapper>
        {status === 'loading' ? <Loading /> : null}
        {status === 'idle' ? (
          <PaperSection title="Positions">
            <SearchPosition onChange={onChange} />
            {filteredPositions?.length > 0 ? <List positions={filteredPositions} /> : null}
            {(filteredPositions?.length === 0 && value !== '') || values?.length === 0 ? (
              <EmptyData />
            ) : null}
          </PaperSection>
        ) : null}
      </BoxContainerWrapper>
    </ErrorBoundaryWrapper>
  )
}

export default WrapperPositions
