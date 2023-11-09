// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import GnosisDao_ethereum from '../../../roles_royce/roles_royce/applications/panic_button_app/config/strategiesGnosisDAOEthereum.json'
import { PossibleExecutionTypeValues } from 'src/views/Position/Form'

export type DAO =
  | 'Gnosis DAO'
  | 'Balancer DAO'
  | 'karpatkey DAO'
  | 'ENS DAO'
  | 'CoW DAO'
  | 'Gnosis Ltd'

export type BLOCKCHAIN = 'Gnosis' | 'Ethereum'

export type DAO_MAPPER_TYPE = {
  name: DAO
  blockchain: BLOCKCHAIN
  config: any
  filePath?: string
}

export const DAO_MAPPER: DAO_MAPPER_TYPE[] = [
  {
    name: 'Gnosis DAO',
    blockchain: 'Ethereum',
    config: GnosisDao_ethereum,
    filePath: 'roles_royce/roles_royce/applications/panic_button_app/panic_button_main.py'
  },
  {
    name: 'Gnosis Ltd',
    blockchain: 'Ethereum',
    config: {}
  },
  {
    name: 'Gnosis DAO',
    blockchain: 'Gnosis',
    config: {}
  },
  {
    name: 'Gnosis Ltd',
    blockchain: 'Gnosis',
    config: {}
  }
]

export enum DEFAULT_VALUES_KEYS {
  position_id = 'position_id',
  protocol = 'protocol',
  blockchain = 'blockchain',
  execution_type = 'execution_type',
  strategy = 'strategy',
  percentage = 'percentage',
  rewards_address = 'rewards_address',
  max_slippage = 'max_slippage',
  token_out_address = 'token_out_address',
  bpt_address = 'bpt_address'
}

export type DEFAULT_VALUES_TYPE = {
  [DEFAULT_VALUES_KEYS.position_id]: Maybe<string>
  [DEFAULT_VALUES_KEYS.protocol]: Maybe<string>
  [DEFAULT_VALUES_KEYS.blockchain]: Maybe<string>
  [DEFAULT_VALUES_KEYS.execution_type]: PossibleExecutionTypeValues
  [DEFAULT_VALUES_KEYS.strategy]: Maybe<string>
  [DEFAULT_VALUES_KEYS.percentage]: Maybe<string>
  [DEFAULT_VALUES_KEYS.rewards_address]: Maybe<string>
  [DEFAULT_VALUES_KEYS.max_slippage]: Maybe<string>
  [DEFAULT_VALUES_KEYS.token_out_address]: Maybe<string>
  [DEFAULT_VALUES_KEYS.bpt_address]: Maybe<string>
}

export type Config = {
  name: DEFAULT_VALUES_KEYS
  label?: string
  type: 'input' | 'constant'
  value?: string
  rules?: {
    min?: number
    max?: number
  }
  options?: { label: string; value: string }[]
}

export type PositionConfig = {
  function_name: string
  label: string
  description: string
  parameters: Config[]
}

export type ExecConfig = {
  commonConfig: Config[]
  positionConfig: PositionConfig[]
}

export const getStrategies = (dao: DAO, blockchain: BLOCKCHAIN) => {
  const DAO_ITEM: DAO_MAPPER_TYPE | undefined = DAO_MAPPER.find(
    (daoMapper) => daoMapper.name === dao && daoMapper.blockchain === blockchain
  )
  return DAO_ITEM
}

export const getStrategyByPositionId = (
  dao: DAO,
  blockchain: BLOCKCHAIN,
  protocol: string,
  positionId: string
) => {
  const DAO_ITEM: DAO_MAPPER_TYPE | undefined = getStrategies(dao, blockchain)

  const positionKey = `${protocol}_${positionId}`
  const position = DAO_ITEM?.config?.positions?.find(
    (position: any) => position.position_id.toLowerCase() === positionKey.toLowerCase()
  )

  return {
    commonConfig: DAO_ITEM?.config?.general_parameters ?? [],
    positionConfig: position?.exec_config ?? []
  } as ExecConfig
}

export const getDAOFilePath = (dao: DAO, blockchain: BLOCKCHAIN) => {
  const DAO_ITEM: DAO_MAPPER_TYPE | undefined = getStrategies(dao, blockchain)
  return DAO_ITEM?.filePath ?? ''
}
