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
import { PossibleExecutionTypeValues } from 'src/views/Position/Form/Types'
import * as path from 'path'

type Status = {
  data: {
    status: boolean
    link?: Maybe<string>
    message?: Maybe<string>
    error?: Maybe<Error>
  }
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
    execution_type: PossibleExecutionTypeValues
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

  const parameters: string[] = []

  // Add the rest of the parameters if needed
  if (dao) {
    parameters.push('--dao')

    parameters.push(DAO_MAPPER[dao])
  }

  if (blockchain) {
    parameters.push('--blockchain')
    parameters.push(`${blockchain.toLowerCase()}`)
  }

  if (execution_type === 'Simulate') {
    parameters.push('--simulate')
  }

  if (protocol) {
    parameters.push('--protocol')
    parameters.push(`${protocol}`)
  }

  if (percentage) {
    parameters.push('--percentage')
    parameters.push(`${percentage}`)
  }

  if (strategy) {
    parameters.push('--exitStrategy')
    parameters.push(`${strategy}`)
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
    parameters.push('--exitArguments')
    parameters.push(`[${JSON.stringify(exitArguments)}]`)
  }

  const DAOFilePath = getDAOFilePath(dao as DAO, blockchain as unknown as BLOCKCHAIN)

  return new Promise<void>((resolve, reject) => {
    try {
      const scriptFile = path.resolve(process.cwd(), DAOFilePath)

      console.log('parameters', parameters)
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

        let response: {
          status?: string
          link?: string
          message?: string
        } = {}
        try {
          response = JSON.parse(buffer.replace(/'/g, '"'))
        } catch (e) {
          console.log('Error with buffer, is not a valid json object', e, buffer)
        }

        const status = response?.status ?? 500
        const link = response?.link ?? ''
        const message = response?.message ?? ''

        console.log('status', status)
        console.log('link', link)
        console.log('message', message)
        res.status(+status).json({ data: { status: true, link, message } })
        resolve()
      })
    } catch (error) {
      console.error('ERROR: ', error)
      res.status(500).json({ data: { status: false, error: error as Error } })
      reject()
    }
  })
})
