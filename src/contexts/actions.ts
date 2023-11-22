import { ExecuteStrategyStatus, Position, Status, Strategy } from './state'

export enum ActionType {
  UpdateStatus,
  AddPositions,
  ClearPositions,
  SetSelectedPosition,
  ClearSelectedPosition,
  SetStrategy,
  SetStrategyStatus
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

export type Actions =
  | UpdateStatus
  | AddPositions
  | ClearPositions
  | SetSelectedPosition
  | ClearSelectedPosition
  | SetStrategy
  | SetStrategyStatus
