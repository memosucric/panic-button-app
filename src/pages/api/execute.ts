import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { spawn } from 'child_process'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession, Session } from '@auth0/nextjs-auth0'
import {
  BLOCKCHAIN,
  DAO,
  getDAOFilePath,
  getStrategyByPositionId
} from 'src/config/strategies/manager'
import * as path from 'path'
import { EXECUTION_TYPE } from 'src/config/strategies/manager'

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

  if(strategy) {
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

  const DAOFilePath = getDAOFilePath(dao as DAO, blockchain as BLOCKCHAIN, execution_type as EXECUTION_TYPE)

  console.log('Parameters', parameters)
  console.log('DAOFilePath', DAOFilePath)

  if(execution_type === 'transaction_builder') {
    return new Promise<void>((resolve, reject) => {
      try {
        const scriptFile = path.resolve(process.cwd(), DAOFilePath)

        const python = spawn(`python3`, [`${scriptFile}`, ...parameters])

        let buffer = ''
        python.stdout.on('data', function (data) {
          buffer += data.toString()

          if (buffer.indexOf('DEBUGGER READY') !== -1) {
            console.log('DEBUGGER READY')
            console.log('after connect_client')
          }
        })

        python.stderr.on('data', function (data) {
          console.log(data.toString())
        })

        python.on('error', function (data) {
          console.log('DEBUG PROGRAM ERROR:')
          console.error('ERROR: ', data.toString())
          res.status(500).json({ data: { status: false, error: new Error('Internal Server Error') } })
          reject()
        })

        python.on('exit', function (code) {
          console.log('Debug Program Exit', code)

          // destroy python process
          python.kill()

          let response = undefined
          console.log('Buffer', buffer)
          try {
            response = JSON.parse(buffer)
          } catch (e) {
            console.log('Error with buffer, is not a valid json object', e, buffer)
          }

          const status = response?.status ?? 500
          const data = response?.tx_data ?? {}

          res.status(+status).json({ data  })
          resolve()
        })
      } catch (error) {
        console.error('ERROR: ', error)
        res.status(500).json({ error: error as Error })
        reject()
      }
    })
  }

  return res.status(500).json({ data: { error: new Error('Internal Server Error') } })
})
