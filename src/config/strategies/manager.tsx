import GnosisDao_ethereum from './ethereum/GnosisDAO.json'
import GnosisLtd_ethereum from './ethereum/GnosisLtd.json'
import GnosisDao_gnosis_chain from './gnosis/GnosisDAO.json'
import GnosisLtd_gnosis_chain from './gnosis/GnosisLtd.json'
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
    filePath: 'src/scripts/mainGnosisDAOEthereum.py'
  },
  {
    name: 'Gnosis Ltd',
    blockchain: 'Ethereum',
    config: GnosisLtd_ethereum
  },
  {
    name: 'Gnosis DAO',
    blockchain: 'Gnosis',
    config: GnosisDao_gnosis_chain
  },
  {
    name: 'Gnosis Ltd',
    blockchain: 'Gnosis',
    config: GnosisLtd_gnosis_chain
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
  token_out_address = 'token_out_address'
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
    commonConfig: DAO_ITEM?.config?.common_exec_config ?? [],
    positionConfig: position?.position_exec_config ?? []
  } as ExecConfig
}

export const getDAOFilePath = (dao: DAO, blockchain: BLOCKCHAIN) => {
  const DAO_ITEM: DAO_MAPPER_TYPE | undefined = getStrategies(dao, blockchain)
  return DAO_ITEM?.filePath ?? ''
}
