export interface InputProps {
  name: string
  control: any
  label?: string
  setValue?: any
}

export type PossibleExecutionTypeValues = 'Simulate' | 'Execute'

export interface ExecutionType {
  name: PossibleExecutionTypeValues
}
