enum DAO {
  Gnosis = 'Gnosis',
  Balancer = 'Balancer',
  karpatkey = 'karpatkey',
  ENS = 'ENS',
  CoW = 'CoW'
}

enum Strategy {
  Withdraw = 'Withdraw',
  Move = 'Move'
}

type StrategyContent = {
  name: Strategy
  filePath: string
  parameters: [
    {
      name: string
      type: 'number' | 'string'
    }
  ]
}

type StrategyList = {
  [key in keyof typeof DAO]: StrategyContent[]
}

const strategies = {
  Gnosis: [
    {
      name: Strategy.Withdraw,
      filePath: 'src/scripts/main.py',
      parameters: [
        {
          name: 'percentage',
          type: 'number'
        }
      ]
    }
  ]
} as StrategyList

export { strategies }
