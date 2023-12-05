import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession, Session } from '@auth0/nextjs-auth0'
import {
  BLOCKCHAIN,
  DAO,
  getDAOFilePath,
  getStrategyByPositionId
} from 'src/config/strategies/manager'
import { EXECUTION_TYPE } from 'src/config/strategies/manager'
import { TransactionBuilderPromise } from 'src/utils/execute'

type Status = {
  data?: Maybe<any>
  error?: Maybe<Error>
}

// Create a mapper for DAOs
const DAO_MAPPER: Record<string, string> = {
  'Gnosis DAO': 'GnosisDAO',
  'Gnosis Ltd': 'GnosisLtd'
}

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Status>
) {
  // Should be a post request
  if (req.method !== 'POST') {
    res.status(405).json({ data: { status: false, error: new Error('Method not allowed') } })
    return
  }

  const session = await getSession(req as any, res as any)

  // Validate session here
  if (!session) {
    res.status(401).json({ data: { status: false, error: new Error('Unauthorized') } })
    return
  }

  // Get User role, if not found, return an error
  const user = (session as Session).user
  const roles = user?.['http://localhost:3000/roles']
    ? (user?.['http://localhost:3000/roles'] as unknown as string[])
    : ['']
  const dao = roles?.[0] ?? ''

  if (!dao) {
    res.status(401).json({ data: { status: false, error: new Error('Unauthorized') } })
    return
  }

  // Get the strategy from the body, if not found, return an error
  const {
    strategy,
    execution_type,
    percentage,
    position_id,
    protocol,
    blockchain,
    exit_arguments
  } = req.body as {
    strategy: Maybe<string>
    execution_type: EXECUTION_TYPE
    percentage: Maybe<number>
    position_id: Maybe<string>
    protocol: Maybe<string>
    blockchain: Maybe<BLOCKCHAIN>
    exit_arguments: {
      rewards_address: Maybe<string>
      max_slippage: Maybe<number>
      token_out_address: Maybe<string>
      bpt_address: Maybe<string>
    }
  }

  const parameters: any[] = []

  // Add the rest of the parameters if needed
  if (percentage) {
    parameters.push('--percentage')
    parameters.push(`${percentage}`)
  }

  if (dao) {
    parameters.push('--dao')
    parameters.push(DAO_MAPPER[dao])
  }

  if (blockchain) {
    parameters.push('--blockchain')
    parameters.push(`${blockchain.toUpperCase()}`)
  }

  if (strategy) {
    parameters.push('--exit-strategy')
    parameters.push(`${strategy}`)
  }

  if (protocol) {
    parameters.push('--protocol')
    parameters.push(`${protocol}`)
  }

  let exitArguments = {}

  // Add CONSTANTS from the strategy
  if (protocol) {
    const { positionConfig } = getStrategyByPositionId(
      dao as DAO,
      blockchain as unknown as BLOCKCHAIN,
      protocol,
      position_id as string
    )
    const positionConfigItemFound = positionConfig?.find(
      (positionConfigItem) => positionConfigItem.function_name === strategy
    )

    positionConfigItemFound?.parameters?.forEach((parameter) => {
      if (parameter.type === 'constant') {
        exitArguments = {
          ...exitArguments,
          [parameter.name]: parameter.value
        }
      }
    })
  }

  // Add the rest of the parameters if needed
  for (const key in exit_arguments) {
    const value = exit_arguments[key as keyof typeof exit_arguments]
    if (value) {
      exitArguments = {
        ...exitArguments,
        [key]: value
      }
    }
  }

  if (Object.keys(exitArguments).length > 0) {
    parameters.push('--exit-arguments')
    parameters.push(`[${JSON.stringify(exitArguments)}]`)
  }

  const DAOFilePath = getDAOFilePath(
    dao as DAO,
    blockchain as BLOCKCHAIN,
    execution_type as EXECUTION_TYPE
  )

  console.log('Parameters', parameters)
  console.log('DAOFilePath', DAOFilePath)

  if (execution_type === 'transaction_builder') {
    try {
      const {
        status = 500,
        data = {},
        error
      } = await TransactionBuilderPromise(DAOFilePath, parameters)

      if (error) {
        console.error('ERROR: ', error)
        return res.status(status).json({ error: error as Error })
      }

      return res.status(status).json(data)
    } catch (error) {
      console.error('ERROR Reject: ', error)
      return res.status(500).json({ error: error as Error })
    }
  }

  return res.status(500).json({ error: new Error('Internal Server Error') })
})
