import {
  Types,
  PositionType,
  PositionActionsType,
  SelectedPositionActionsType,
  StatusType,
  StatusActionsType
} from './types'

export const positionReducer = (state: PositionType[], action: PositionActionsType) => {
  switch (action.type) {
    case Types.CreatePosition:
      return [...state, action.payload]
    case Types.BulkPositions:
      return [...action.payload]
    case Types.ClearPositions:
      return []
    case Types.DeletePosition:
      return [
        ...state.filter(
          (position) => position.position_id.toLowerCase() !== action.payload.toLowerCase()
        )
      ]
    default:
      return state
  }
}

export const selectedPositionReducer = (
  state: Maybe<PositionType>,
  action: SelectedPositionActionsType
) => {
  switch (action.type) {
    case Types.UpdatePositionSelected:
      return {
        ...action.payload
      }
    case Types.ClearPositionSelected:
      return null
    default:
      return state
  }
}

export const statusReducer = (state: StatusType, action: StatusActionsType) => {
  switch (action.type) {
    case Types.UpdateStatus:
      return action.payload
    default:
      return state
  }
}
