import 'src/scripts/dump/loadEnv'
import { DataWarehouse } from 'src/services/classes/dataWarehouse.class'
import { PositionType } from 'src/contexts/types'
import * as fs from 'fs'

;(async () => {
  try {
    const dataWarehouse = DataWarehouse.getInstance()
    const allPositions: PositionType[] = await dataWarehouse.getPositions()
    const allPositionsSortedById = allPositions.sort((a, b) => +a?.position_id - +b?.position_id)
    const data = JSON.stringify(allPositionsSortedById, null, 2)
    fs.writeFileSync('positions.json', data)
  } catch (e) {
    console.error(e)
    throw e
  }
})()
