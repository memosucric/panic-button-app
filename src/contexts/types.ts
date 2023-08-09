export type TokenType = {
  balance: number
  symbol: string
  usdValue: number
}

export type RatioType = {
  name: string
  value: number
}

export type CategoryType = {
  name: string
  tokens?: TokenType[]
  ratios?: RatioType[]
}

export type PositionType = {
  id: string
  blockchain: string
  cardType: string
  dao: string
  position: string
  protocol: string
  totalUsdValue: number
  categories: CategoryType[]
}

export type StatusType = 'idle' | 'loading' | 'error'

export type InitialStateType = {
  positions: {
    status: StatusType
    values: PositionType[]
    selectedValue: Maybe<PositionType>
  }
}

export type PositionPayloadType = {
  [Types.CreatePosition]: PositionType
  [Types.BulkPositions]: PositionType[]
  [Types.DeletePosition]: {
    id: string
  }
}

export type SelectedPositionPayloadType = {
  [Types.UpdatePositionSelected]: PositionType
  [Types.ClearPositionSelected]: null
}

export type StatusPayloadType = {
  [Types.UpdateStatus]: StatusType
}

export enum Types {
  CreatePosition = 'CREATE_POSITION',
  BulkPositions = 'BULK_POSITIONS',
  DeletePosition = 'DELETE_POSITION',
  UpdatePositionSelected = 'UPDATE_POSITION_SELECTED',
  ClearPositionSelected = 'CLEAR_POSITION_SELECTED',
  UpdateStatus = 'UPDATE_STATUS'
}

export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key
      }
    : {
        type: Key
        payload: M[Key]
      }
}

export type PositionActionsType =
  ActionMapType<PositionPayloadType>[keyof ActionMapType<PositionPayloadType>]

export type SelectedPositionActionsType =
  ActionMapType<SelectedPositionPayloadType>[keyof ActionMapType<SelectedPositionPayloadType>]

export type StatusActionsType =
  ActionMapType<StatusPayloadType>[keyof ActionMapType<StatusPayloadType>]
