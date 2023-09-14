import Strategies from './strategies.json'

export type DAO = 'Gnosis DAO' | 'Balancer DAO' | 'karpatkey DAO' | 'ENS DAO' | 'CoW DAO'

export type Parameter = {
  name: string
  value: string | number
  enable: boolean
}

export type ExecConfig = {
  name: string
  description: string
  parameters: Parameter[]
}

export type Position = {
  position_id: string
  exec_config: ExecConfig[]
}

export type StrategyContent = {
  file_path: string
  positions: Position[]
}

export type StrategyList = {
  [key in DAO]: StrategyContent
}

const strategiesManager = Strategies as StrategyList

const getStrategies = (dao: DAO) => {
  return strategiesManager[dao]
}

export { strategiesManager, getStrategies }
