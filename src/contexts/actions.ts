import { ExecuteStrategyStatus, Position, Status, Strategy, TransactionBuild } from './state'

export enum ActionType {
  UpdateStatus,
  AddPositions,
  ClearPositions,
  SetSelectedPosition,
  ClearSelectedPosition,
  SetStrategy,
  SetStrategyStatus,
  SetTransactionBuild,
  SetTransactionCheck
}

export interface UpdateStatus {
  type: ActionType.UpdateStatus
  payload: Status
}

export interface AddPositions {
  type: ActionType.AddPositions
  payload: Position[]
}

export interface ClearPositions {
  type: ActionType.ClearPositions
}

export interface SetSelectedPosition {
  type: ActionType.SetSelectedPosition
  payload: Position
}

export interface ClearSelectedPosition {
  type: ActionType.ClearSelectedPosition
}

export interface SetStrategy {
  type: ActionType.SetStrategy
  payload: Strategy
}

export interface SetStrategyStatus {
  type: ActionType.SetStrategyStatus
  payload: ExecuteStrategyStatus
}

export interface SetTransactionBuild {
  type: ActionType.SetTransactionBuild
  payload: TransactionBuild
}

export interface SetTransactionCheck {
  type: ActionType.SetTransactionCheck
  payload: boolean
}

export type Actions =
  | UpdateStatus
  | AddPositions
  | ClearPositions
  | SetSelectedPosition
  | ClearSelectedPosition
  | SetStrategy
  | SetStrategyStatus
  | SetTransactionBuild
  | SetTransactionCheck
