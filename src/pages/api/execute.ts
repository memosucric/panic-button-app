import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { spawn } from 'child_process'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession, Session } from '@auth0/nextjs-auth0'
import {
  DAO,
  ExecConfig,
  getStrategies,
  Parameter,
  Position,
  StrategyContent
} from '../../config/strategies/manager'
import { PossibleExecutionTypeValues } from 'src/views/Position/Form'
import * as path from 'path'

type Status = {
  data: {
    status: boolean
    trx?: Maybe<string>
    error?: Maybe<Error>
  }
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
  const { strategy, executionType, percentage } = req.body as {
    strategy: string
    executionType: PossibleExecutionTypeValues
    percentage: number
  }

  const daoContent: StrategyContent = getStrategies(dao as DAO)

  const position: Position | undefined = daoContent?.positions?.find((position: Position) => {
    return position?.exec_config?.find((exec: ExecConfig) => exec.name === strategy)
  })

  const strategies: ExecConfig[] = position?.exec_config ?? []
  const strategyObject = strategies.find((s) => s.name === strategy)

  if (!strategyObject || !strategyObject?.parameters?.length) {
    res.status(401).json({ data: { status: false, error: new Error('Unauthorized') } })
    return
  }

  // Build parameters to add as a parameters to the python script
  const parameters = strategyObject.parameters.reduce((acc: string[], parameter: Parameter) => {
    if (parameter.enable) {
      acc.push(`--${parameter.name}`)
      acc.push(`${parameter.value}`)
    }
    return acc
  }, [])

  // Add the rest of the parameters if needed
  if (executionType === 'Simulate') {
    parameters.push('--simulate')
  }

  if (executionType === 'Normal execution') {
    parameters.push('--execute')
  }

  if (percentage) {
    parameters.push('-p')
    parameters.push(`${percentage}`)
  }

  return new Promise<void>((resolve, reject) => {
    try {
      const scriptFile = path.resolve(process.cwd(), daoContent.file_path)

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
        console.log('Debug Program Exit')
        console.log(code)
        // destroy python process
        python.kill()

        const match = buffer?.match(
          /\b((https?|ftp|file):\/\/|(www|ftp)\.)[-A-Z0-9+&@#\/%?=~_|$!:,.;]*[A-Z0-9+&@#\/%=~_|$]/gi
        )
        const trx = match ? match[0] : null

        res.status(200).json({ data: { status: true, trx } })
        resolve()
      })
    } catch (error) {
      console.error('ERROR: ', error)
      res.status(500).json({ data: { status: false, error: error as Error } })
      reject()
    }
  })
})
