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

const strategies = {
  'Gnosis DAO': [
    {
      name: Strategy.Withdraw,
      filePath: 'src/scripts/main.py',
      parameters: [
        {
          name: 'percentage',
          label: 'Percentage',
          type: 'number'
        }
      ]
    },
    {
      name: Strategy.Move,
      filePath: 'src/scripts/main.py',
      parameters: [
        {
          name: 'percentage',
          label: 'Percentage',
          type: 'number'
        },
        {
          name: 'address',
          label: 'Address',
          type: 'string'
        }
      ]
    }
  ]
} as StrategyList

const getStrategies = (dao: DAO) => {
  return strategies[dao]
}

export { strategies, getStrategies }
