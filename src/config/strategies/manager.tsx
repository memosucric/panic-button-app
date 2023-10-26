import KPK from './Kpk.json'
import ENS from './ENS.json'
import GnosisDAO from './GnosisDAO.json'
import GnosisLtd from './GnosisLtd.json'

export type DAO =
  | 'Gnosis DAO'
  | 'Balancer DAO'
  | 'karpatkey DAO'
  | 'ENS DAO'
  | 'CoW DAO'
  | 'Gnosis Ltd'

export type BLOCKCHAIN_DATAWAREHOUSE = 'Gnosis' | 'Ethereum'

export const BLOCKCHAIN_MAPPER = {
  Gnosis: 'gnosisChain',
  Ethereum: 'ethereum'
}

export const DAO_MAPPER: { [key in DAO]: any } = {
  'Gnosis DAO': GnosisDAO,
  'Balancer DAO': GnosisDAO,
  'karpatkey DAO': KPK,
  'ENS DAO': ENS,
  'CoW DAO': GnosisDAO,
  'Gnosis Ltd': GnosisLtd
}

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

const getStrategies = (dao: DAO) => {
  const manager = DAO_MAPPER[dao as keyof typeof DAO_MAPPER] as StrategyList
  return manager[dao]
}

export { getStrategies }
