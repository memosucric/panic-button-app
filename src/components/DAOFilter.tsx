import * as React from 'react'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { useApp } from 'src/contexts/app.context'
import { filter, setSelectedDAO } from 'src/contexts/reducers'

export const DAOFilter = () => {
  const { dispatch, state } = useApp()
  const DAO = state?.selectedDAO ?? 'Gnosis DAO'
  const options = state?.DAOs ?? []
  const handleChange = React.useCallback(
    (event: React.MouseEvent<HTMLElement>, newDAO: string) => {
      if (newDAO === null || newDAO === DAO) return

      dispatch(setSelectedDAO(newDAO))
      dispatch(filter())
    },
    [dispatch, DAO]
  )

  return (
    <ToggleButtonGroup
      color="primary"
      value={DAO}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
      sx={{ margin: '25px 48px' }}
    >
      {options.map((option: string, index: number) => {
        return (
          <ToggleButton key={index} value={option} disabled={options.length === 1}>
            {option}
          </ToggleButton>
        )
      })}
    </ToggleButtonGroup>
  )
}
