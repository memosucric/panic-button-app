import React, { createContext, useReducer } from 'react'
import { positionReducer, selectedPositionReducer, statusReducer } from './reducers'
import {
  InitialStateType,
  PositionActionsType,
  SelectedPositionActionsType,
  StatusActionsType
} from './types'

const initialState: InitialStateType = {
  positions: {
    status: 'loading',
    values: [],
    selectedValue: null
  }
}

const AppContext = createContext<{
  state: InitialStateType
  dispatch: React.Dispatch<PositionActionsType | SelectedPositionActionsType | StatusActionsType>
}>({
  state: initialState,
  dispatch: () => null
})

const mainReducer = (
  initialState: InitialStateType,
  action: PositionActionsType | SelectedPositionActionsType | StatusActionsType
) => {
  const { positions } = initialState
  const { selectedValue, status, values } = positions
  return {
    positions: {
      values: positionReducer(values, action as PositionActionsType),
      selectedValue: selectedPositionReducer(selectedValue, action as SelectedPositionActionsType),
      status: statusReducer(status, action as StatusActionsType)
    }
  }
}

interface AppProviderProps {
  children: React.ReactNode
}

const AppProvider = ({ children }: AppProviderProps) => {
  const [state, dispatch] = useReducer(mainReducer, initialState)

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

const useApp = () => {
  const context = React.useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export { AppContext, AppProvider, useApp }
