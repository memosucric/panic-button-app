import {Position, Strategy, Status, InitialState, ExecuteStrategyStatus, TransactionBuild} from './state'
import {
  Actions,
  ActionType,
  UpdateStatus,
  AddPositions,
  ClearPositions,
  SetSelectedPosition,
  ClearSelectedPosition,
  SetStrategy,
  SetStrategyStatus,
  SetTransactionBuild,
  SetTransactionCheck
} from './actions'

export const mainReducer = (state: InitialState, action: Actions): InitialState => {
  switch (action.type) {
    case ActionType.UpdateStatus:
      return {
        ...state,
        status: action.payload
      }
    case ActionType.AddPositions:
      return {
        ...state,
        positions: action.payload
      }
    case ActionType.ClearPositions:
      return {
        ...state,
        positions: []
      }
    case ActionType.SetSelectedPosition:
      return {
        ...state,
        selectedPosition: action.payload
      }
    case ActionType.ClearSelectedPosition:
      return {
        ...state,
        selectedPosition: null
      }
    case ActionType.SetStrategy:
      return {
        ...state,
        strategy: {
          ...state.strategy,
          create: action.payload
        }
      }
    case ActionType.SetStrategyStatus:
      return {
        ...state,
        strategy: {
          ...state.strategy,
          status: action.payload
        }
      }
    case ActionType.SetTransactionBuild:
      return {
        ...state,
        strategy: {
          ...state.strategy,
          transactionBuild: action.payload
        }
      }

    case ActionType.SetTransactionCheck:
      return {
        ...state,
        strategy: {
          ...state.strategy,
          transactionCheck: action.payload
        }
      }
    default:
      return state
  }
}

// Helper functions to simplify the caller
export const updateStatus = (status: Status): UpdateStatus => ({
  type: ActionType.UpdateStatus,
  payload: status
})

export const addPositions = (positions: Position[]): AddPositions => ({
  type: ActionType.AddPositions,
  payload: positions
})

export const clearPositions = (): ClearPositions => ({
  type: ActionType.ClearPositions
})

export const setSelectedPosition = (position: Position): SetSelectedPosition => ({
  type: ActionType.SetSelectedPosition,
  payload: position
})

export const clearSelectedPosition = (): ClearSelectedPosition => ({
  type: ActionType.ClearSelectedPosition
})

export const setStrategy = (strategy: Strategy): SetStrategy => ({
  type: ActionType.SetStrategy,
  payload: strategy
})

export const setStrategyStatus = (status: ExecuteStrategyStatus): SetStrategyStatus => ({
  type: ActionType.SetStrategyStatus,
  payload: status
})

export const setStrategyTransactionBuild = (transactionBuild: TransactionBuild): SetTransactionBuild => ({
  type: ActionType.SetTransactionBuild,
  payload: transactionBuild
})

export const setStrategyTransactionCheck = (status: boolean): SetTransactionCheck => ({
  type: ActionType.SetTransactionCheck,
  payload: status
})
