export type PositionType = {
  position_id: string
  dao: string
  protocol: string
  blockchain: string
  lptoken_address: string
  lptoken_name: string
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
  [Types.ClearPositions]: []
  [Types.DeletePosition]: string
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
  ClearPositions = 'CLEAR_POSITIONS',
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
