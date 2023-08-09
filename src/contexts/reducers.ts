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
      return [...state, ...action.payload]
    case Types.DeletePosition:
      return [...state.filter((card) => card.id.toLowerCase() !== action.payload.id.toLowerCase())]
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
        id: action.payload.id,
        blockchain: action.payload.blockchain,
        cardType: action.payload.cardType,
        dao: action.payload.dao,
        position: action.payload.position,
        protocol: action.payload.protocol,
        totalUsdValue: action.payload.totalUsdValue,
        categories: action.payload.categories
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
