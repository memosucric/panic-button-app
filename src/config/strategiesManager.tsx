import Strategies from './strategies.json'

export type DAO = 'Gnosis DAO' | 'Balancer DAO' | 'karpatkey DAO' | 'ENS DAO' | 'CoW DAO'

enum Strategy {
  Withdraw = 'Withdraw',
  Move = 'Move'
}

export type StrategyContent = {
  name: Strategy
  filePath: string
  parameters: [
    {
      name: string
      label: string
      type: 'number' | 'text'
    }
  ]
}

export type StrategyList = {
  [key in DAO]: StrategyContent[]
}

const strategiesManager = Strategies as StrategyList

const getStrategies = (dao: DAO) => {
  return strategiesManager[dao]
}

export { strategiesManager, getStrategies }
