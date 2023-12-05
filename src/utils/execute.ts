import path from 'path'
import { spawn } from 'child_process'

interface TransactionBuilderReturn {
  status: number
  data: any
  error?: Error
}

export const TransactionBuilderPromise = (
  filePath: string,
  parameters: any
): Promise<TransactionBuilderReturn> => {
  return new Promise((resolve, reject) => {
    try {
      const scriptFile = path.resolve(process.cwd(), filePath)

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
        reject({ status: 500, error: new Error(data.toString()) })
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

        const body = {
          data: status === 200 ? response?.tx_data ?? {} : {},
          error: status !== 200 ? response?.message ?? {} : {}
        }

        resolve({
          status: +status,
          ...body
        })
      })
    } catch (error) {
      console.error('ERROR Reject: ', error)
      reject({
        status: 500,
        error: error as Error
      })
    }
  })
}
