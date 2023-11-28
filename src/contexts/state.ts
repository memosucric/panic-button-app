export enum Status {
  Loading = 'Loading',
  Finished = 'Finished'
}

export enum ExecuteStrategyStatus {
  Loading = 'loading',
  Create = 'create',
  TransactionBuild = 'transaction_build',
  TransactionCheck = 'transaction_check',
  Simulation = 'simulation',
  Confirm = 'confirm',
  Error = 'error'
}

export type Position = {
  position_id: string
  dao: string
  protocol: string
  blockchain: string
  lptoken_address: string
  lptoken_name: string
}

export type Strategy = {
  id: string
  name: string
  description: string
  rewards_address: Maybe<string>
  max_slippage: Maybe<number>
  token_out_address: Maybe<string>
  bpt_address: Maybe<string>
  percentage: Maybe<number>
  blockchain: Maybe<string>
  protocol: Maybe<string>
  position_id: Maybe<string>
  position_name: Maybe<string>
}

export type TransactionBuild = {
  transaction: any
  decodedTransaction: any
}

export const initialState: InitialState = {
  status: Status.Loading,
  positions: [],
  selectedPosition: null,
  strategy: {
    status: ExecuteStrategyStatus.Loading,
    create: null,
    transactionBuild: null,
    transactionCheck: null
  }
}

export type InitialState = {
  status: Status
  positions: Position[]
  selectedPosition: Maybe<Position>
  strategy: {
    status: ExecuteStrategyStatus
    create: Maybe<Strategy>
    transactionBuild: Maybe<TransactionBuild>
    transactionCheck: Maybe<boolean>
  }
}
