import { Position, SetupItemStatus, SetupStatus, Status, Strategy, TransactionBuild } from './state'

export enum ActionType {
  UpdateStatus,
  AddPositions,
  ClearPositions,
  SetSelectedPosition,
  ClearSelectedPosition,
  SetSetupCreate,
  SetSetupCreateStatus,
  SetSetupTransactionBuild,
  SetSetupTransactionBuildStatus,
  SetSetupTransactionCheck,
  SetSetupTransactionCheckStatus,
  SetSetupSimulation,
  SetSetupSimulationStatus,
  SetSetupConfirm,
  SetSetupConfirmStatus,
  SetSetupStatus,
  ClearSetup,
  ClearSetupWithoutCreate,
  AddDaosConfigs
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

export interface SetSetupCreate {
  type: ActionType.SetSetupCreate
  payload: Strategy
}

export interface SetSetupCreateStatus {
  type: ActionType.SetSetupCreateStatus
  payload: SetupItemStatus
}

export interface SetSetupTransactionBuild {
  type: ActionType.SetSetupTransactionBuild
  payload: TransactionBuild
}

export interface SetSetupTransactionBuildStatus {
  type: ActionType.SetSetupTransactionBuildStatus
  payload: SetupItemStatus
}

export interface SetSetupTransactionCheck {
  type: ActionType.SetSetupTransactionCheck
  payload: boolean
}

export interface SetSetupTransactionCheckStatus {
  type: ActionType.SetSetupTransactionCheckStatus
  payload: SetupItemStatus
}

export interface SetSetupSimulation {
  type: ActionType.SetSetupSimulation
  payload: boolean
}

export interface SetSetupSimulationStatus {
  type: ActionType.SetSetupSimulationStatus
  payload: SetupItemStatus
}

export interface SetSetupConfirm {
  type: ActionType.SetSetupConfirm
  payload: boolean
}

export interface SetSetupConfirmStatus {
  type: ActionType.SetSetupConfirmStatus
  payload: SetupItemStatus
}

export interface SetSetupStatus {
  type: ActionType.SetSetupStatus
  payload: SetupStatus
}

export interface ClearSetup {
  type: ActionType.ClearSetup
}

export interface ClearSetupWithoutCreate {
  type: ActionType.ClearSetupWithoutCreate
}

export interface AddDaosConfigs {
  type: ActionType.AddDaosConfigs
  payload: any[]
}

export type Actions =
  | UpdateStatus
  | AddPositions
  | ClearPositions
  | SetSelectedPosition
  | ClearSelectedPosition
  | SetSetupCreate
  | SetSetupCreateStatus
  | SetSetupTransactionBuild
  | SetSetupTransactionBuildStatus
  | SetSetupTransactionCheck
  | SetSetupTransactionCheckStatus
  | SetSetupSimulation
  | SetSetupSimulationStatus
  | SetSetupConfirm
  | SetSetupConfirmStatus
  | SetSetupStatus
  | ClearSetup
  | ClearSetupWithoutCreate
  | AddDaosConfigs
