import CustomTypography from 'src/components/CustomTypography'
import Button from '@mui/material/Button'
import * as React from 'react'
import { AccordionBoxWrapper } from 'src/components/Accordion/AccordionBoxWrapper'
import { useApp } from 'src/contexts/app.context'
import { setSetupSimulation, setSetupSimulationStatus, setSetupStatus } from 'src/contexts/reducers'
import { SetupItemStatus, SetupStatus } from 'src/contexts/state'
import BoxWrapperRow from 'src/components/Wrappers/BoxWrapperRow'
import BoxWrapperColumn from 'src/components/Wrappers/BoxWrapperColumn'
import StatusLabel from 'src/components/StatusLabel'
import { Box } from '@mui/material'

const WaitingSimulatingTransaction = () => {
  return (
    <Box sx={{ width: '100%', paddingTop: '16px', paddingBottom: '16px' }}>
      <CustomTypography variant={'subtitle1'} sx={{ color: 'black' }}>
        Simulating transaction...
      </CustomTypography>
    </Box>
  )
}

export const Tenderly = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { dispatch, state } = useApp()

  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const { blockchain } = state?.setup?.create?.value ?? {}
  const { transaction, decodedTransaction } = state?.setup?.transactionBuild?.value ?? {}
  const transactionBuildStatus = state?.setup?.transactionBuild?.status ?? null
  const simulationStatus = state?.setup?.simulation?.status ?? null
  const shareUrl = state?.setup?.simulation?.value?.shareUrl ?? null
  const selectedDAO = state?.selectedPosition?.dao ?? null

  const isDisabled = React.useMemo(
    () =>
      !blockchain || !transaction || !decodedTransaction || transactionBuildStatus !== 'success',
    [blockchain, transaction, decodedTransaction, transactionBuildStatus]
  )

  React.useEffect(() => {
    if (!isDisabled && simulationStatus === 'not done' && !isLoading) {
      onSimulate().then(() => console.log('Simulation finished'))
    }
  }, [isDisabled, simulationStatus, isLoading])

  const onSimulate = React.useCallback(async () => {
    try {
      setIsLoading(true)

      dispatch(setSetupSimulation(null))
      dispatch(setSetupStatus('simulation' as SetupStatus))
      dispatch(setSetupSimulationStatus('loading' as SetupItemStatus))

      const parameters = {
        execution_type: 'simulate',
        transaction: transaction,
        blockchain,
        dao: selectedDAO
      }

      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parameters)
      })

      const body = await response.json()

      const { status, data = {} } = body

      if (status === 500) {
        const errorMessage =
          typeof body?.error === 'string' ? body?.error : 'Error trying to simulate the transaction'
        throw new Error(errorMessage)
      }

      const { share_url } = data ?? {}

      if (share_url) {
        dispatch(setSetupSimulation({ shareUrl: share_url }))
        dispatch(setSetupSimulationStatus('success' as SetupItemStatus))
        dispatch(setSetupStatus('simulation' as SetupStatus))
        window.open(share_url, '_blank')
      } else {
        throw new Error('Error trying to simulate transaction')
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err as Error)
      dispatch(setSetupSimulationStatus('failed' as SetupItemStatus))
    }

    setIsLoading(false)
  }, [blockchain, transaction, dispatch, isDisabled, selectedDAO])

  const showSimulateButton = !isLoading && !shareUrl && !isDisabled
  return (
    <AccordionBoxWrapper
      gap={2}
      sx={{
        m: 3,
        backgroundColor: 'background.default'
      }}
    >
      <BoxWrapperColumn gap={4} sx={{ width: '100%', marginY: '14px', justifyContent: 'center' }}>
        <BoxWrapperRow sx={{ justifyContent: 'space-between' }}>
          <CustomTypography variant="body2">Simulation</CustomTypography>
          <StatusLabel status={simulationStatus} />
        </BoxWrapperRow>
        <BoxWrapperRow sx={{ justifyContent: 'flex-end' }} gap="20px">
          {isLoading && <WaitingSimulatingTransaction />}
          {simulationStatus === ('failed' as SetupItemStatus) && !isLoading && (
            <CustomTypography variant="body2" sx={{ color: 'red', overflow: 'auto' }}>
              {error?.message && typeof error?.message === 'string'
                ? error?.message
                : 'Error trying to simulate transaction'}
            </CustomTypography>
          )}
          {shareUrl && !isLoading && (
            <Button
              variant="contained"
              size="small"
              onClick={() => window.open(shareUrl, '_blank')}
            >
              View simulation report
            </Button>
          )}

          {showSimulateButton && (
            <Button variant="contained" size="small" onClick={onSimulate}>
              Try again
            </Button>
          )}
        </BoxWrapperRow>
      </BoxWrapperColumn>
    </AccordionBoxWrapper>
  )
}
