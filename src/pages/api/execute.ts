import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { spawn } from 'child_process'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession, Session } from '@auth0/nextjs-auth0'
import {
  DAO,
  ExecConfig,
  getStrategies,
  Parameter,
  StrategyContent
} from 'src/config/strategiesManager'

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
  const { strategy, simulate } = req.body

  const daoContent: StrategyContent = getStrategies(dao as DAO)

  const position = daoContent?.positions.find((position) => {
    return position?.exec_config?.find((exec) => exec.name === strategy)
  })

  const strategies: ExecConfig[] = position?.exec_config ?? []
  const strategyObject = strategies.find((s) => s.name === strategy)

  if (!strategyObject || !strategyObject?.parameters.length) {
    res.status(401).json({ data: { status: false, error: new Error('Unauthorized') } })
    return
  }

  // Build parameters to add as a parameters to the python script
  const parameters = strategyObject.parameters.reduce((acc: string[], parameter: Parameter) => {
    acc.push(`--${parameter.name}`)
    acc.push(`${parameter.value}`)
    return acc
  }, [])

  // Add the simulate flag if needed
  if (simulate) {
    parameters.push('--simulate')
  }

  // TODO remove this, we should get this from the form
  parameters.push('-p')
  parameters.push('100')

  return new Promise<void>((resolve, reject) => {
    try {
      let message: string
      // spawn new child process to call the python script
      const python = spawn('python3', [daoContent.file_path, ...parameters])

      // collect data from script
      python.stdout.on('data', (data) => {
        console.log('Pipe data from python script ...')
        message = data.toString()
      })

      // in close event we are sure that stream from child process is closed
      python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code} and message: ${message}`)

        const status = code === 120 || message?.includes('Success')
        const match = message?.match(
          /\b((https?|ftp|file):\/\/|(www|ftp)\.)[-A-Z0-9+&@#\/%?=~_|$!:,.;]*[A-Z0-9+&@#\/%=~_|$]/gi
        )
        const trx = match ? match[0].substring(0, match[0].indexOf('|')) : null

        const data = {
          status,
          trx
        }

        // send data to browser
        res.status(200).json({ data })
        resolve()
      })
    } catch (error) {
      console.error('Error: ', error)
      res.status(500).json({ data: { status: false, error: error as Error } })
      reject()
    }
  })
})
