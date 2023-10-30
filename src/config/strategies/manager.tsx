import GnosisDao_ethereum from './ethereum/GnosisDAO.json'
import GnosisLtd_ethereum from './ethereum/GnosisLtd.json'
import GnosisDao_gnosis_chain from './gnosis/GnosisDAO.json'
import GnosisLtd_gnosis_chain from './gnosis/GnosisLtd.json'

export type DAO =
  | 'Gnosis DAO'
  | 'Balancer DAO'
  | 'karpatkey DAO'
  | 'ENS DAO'
  | 'CoW DAO'
  | 'Gnosis Ltd'

export type BLOCKCHAIN = 'Gnosis' | 'Ethereum'

export type DAO_MAPPER_TYPE = {
  name: DAO,
  blockchain: BLOCKCHAIN,
  config: any
}

export const DAO_MAPPER: DAO_MAPPER_TYPE[] = [
  {
    name: 'Gnosis DAO',
    blockchain: 'Ethereum',
    config: GnosisDao_ethereum
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

const getStrategies = (dao: DAO, blockchain: BLOCKCHAIN) => {
  const DAO_ITEM: DAO_MAPPER_TYPE | undefined = DAO_MAPPER.find((daoMapper) => daoMapper.name === dao &&
    daoMapper.blockchain === blockchain)
  return DAO_ITEM
}

export { getStrategies }
