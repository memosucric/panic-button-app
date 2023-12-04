import BoxWrapperRow from 'src/components/Wrappers/BoxWrapperRow'
import {
  AccordionSummary,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CustomTypography from 'src/components/CustomTypography'
import AccordionDetails from '@mui/material/AccordionDetails'
import * as React from 'react'
import { AccordionWrapper } from 'src/components/Accordion/AccordionWrapper'
import { useApp } from 'src/contexts/app.context'
import BoxWrapperColumn from 'src/components/Wrappers/BoxWrapperColumn'
import {
  setSetupStatus,
  setSetupTransactionBuild,
  setSetupTransactionBuildStatus,
  setSetupTransactionCheck,
  setSetupTransactionCheckStatus
} from 'src/contexts/reducers'
import { SetupItemStatus, SetupStatus, TransactionBuild } from 'src/contexts/state'
import { shortenAddress } from 'src/utils/string'

const LABEL_MAPPER = {
  value: {
    label: 'Value',
    order: 1
  },
  chainId: {
    label: 'Chain Id',
    order: 2
  },
  gas: {
    label: 'Gas',
    order: 3
  },
  maxFeePerGas: {
    label: 'Max fee per gas',
    order: 4
  },
  maxPriorityFeePerGas: {
    label: 'Max priority fee per gas',
    order: 5
  },
  nonce: {
    label: 'Nonce',
    order: 6
  },
  to: {
    label: 'To',
    order: 7
  },
  from: {
    label: 'From',
    order: 8
  }
}

const WaitingDecodingTransaction = () => {
  return (
    <BoxWrapperColumn
      sx={{ width: '100%', justifyContent: 'center', alignItems: 'center', padding: '16px' }}
    >
      <CustomTypography variant={'body2'} sx={{ color: 'black' }}>
        Waiting for decoding transaction process...
      </CustomTypography>
    </BoxWrapperColumn>
  )
}

export const TransactionDetails = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { dispatch, state } = useApp()

  const [isLoading, setIsLoading] = React.useState(false)

  const transactionBuildValue = state?.setup?.transactionBuild?.value ?? null
  const transactionBuildStatus = state?.setup?.transactionBuild?.status ?? null
  const formValue = state?.setup?.create?.value ?? null

  const [error, setError] = React.useState<Maybe<Error>>(null)
  const [expanded, setExpanded] = React.useState('panel1')

  React.useEffect(() => {
    if (!formValue) return

    const {
      name: strategy,
      percentage,
      position_id,
      position_name,
      protocol,
      blockchain,
      bpt_address,
      max_slippage,
      rewards_address,
      token_out_address
    } = formValue

    const parameters = {
      execution_type: 'transaction_builder',
      strategy,
      percentage,
      position_id,
      position_name,
      protocol,
      blockchain,
      exit_arguments: {
        bpt_address,
        max_slippage,
        rewards_address,
        token_out_address
      }
    }

    const postData = async (data: any) => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/execute', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })

        const body = await response.json()

        const { status } = response

        // check if response is 422
        if (status === 422) {
          const errorMessage =
            typeof body?.error === 'string' ? body?.error : 'Error decoding transaction'
          dispatch(setSetupTransactionCheck(false))
          dispatch(setSetupTransactionCheckStatus('failed' as SetupItemStatus))

          throw new Error(errorMessage)
        }

        if (status === 500) {
          const errorMessage =
            typeof body?.error === 'string' ? body?.error : 'Error decoding transaction'
          throw new Error(errorMessage)
        }

        const { transaction, decoded_transaction: decodedTransaction } = body?.data ?? {}

        // Here we check for the code 200
        const isTransactionChecked = !!transaction && !!decodedTransaction && status === 200
        if (isTransactionChecked) {
          dispatch(
            setSetupTransactionBuild({ transaction, decodedTransaction } as TransactionBuild)
          )
          dispatch(setSetupTransactionBuildStatus('success' as SetupItemStatus))

          dispatch(setSetupTransactionCheck(isTransactionChecked))
          dispatch(setSetupTransactionCheckStatus('success' as SetupItemStatus))

          dispatch(setSetupStatus('transaction_check' as SetupStatus))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error as Error)
        dispatch(setSetupTransactionBuildStatus('failed' as SetupItemStatus))
      }
      setIsLoading(false)
    }

    postData(parameters)
  }, [formValue])

  const parameters = React.useMemo(() => {
    if (!transactionBuildValue) return []
    const { transaction } = transactionBuildValue

    return Object.keys(transaction)
      .filter((key) => LABEL_MAPPER[key as keyof typeof LABEL_MAPPER])
      .sort((a, b) => {
        return (
          LABEL_MAPPER[a as keyof typeof LABEL_MAPPER].order -
          LABEL_MAPPER[b as keyof typeof LABEL_MAPPER].order
        )
      })
      .map((key) => {
        return {
          key,
          label: LABEL_MAPPER[key as keyof typeof LABEL_MAPPER].label,
          value: transaction[key as keyof typeof transaction]
        }
      })
      .filter(({ value }) => value)
  }, [transactionBuildValue])

  const handleChange = (panel: any) => (event: any, newExpanded: any) => {
    setExpanded(newExpanded ? panel : false)
  }

  return (
    <BoxWrapperRow gap={2} sx={{ m: 3, backgroundColor: 'custom.grey.light' }}>
      <AccordionWrapper
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
        sx={{ width: '100%' }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <BoxWrapperRow>
            <CustomTypography variant={'body2'}>Transaction details</CustomTypography>
          </BoxWrapperRow>
        </AccordionSummary>
        <AccordionDetails sx={{ justifyContent: 'flex-start', display: 'flex' }}>
          <BoxWrapperColumn sx={{ width: '100%' }} gap={2}>
            {isLoading && <WaitingDecodingTransaction />}
            {transactionBuildValue && parameters?.length > 0 && !isLoading && (
              <>
                <TableContainer>
                  <Table sx={{ minWidth: 350 }}>
                    <TableBody>
                      {parameters.map(({ label, value, key }, index) => {
                        if (!value || !label) return null

                        return (
                          <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {label}
                            </TableCell>
                            <TableCell align="right">
                              {key === 'to' || key === 'from' ? (
                                <span title={value}>{shortenAddress(value)}</span>
                              ) : (
                                value
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
            {transactionBuildValue && transactionBuildValue?.decodedTransaction && !isLoading && (
              <BoxWrapperColumn
                sx={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  fontSize: '0.8rem'
                }}
              >
                <CustomTypography variant={'body2'}>Decoded Transaction</CustomTypography>
                <Box
                  sx={{
                    width: '-webkit-fill-available;',
                    overflow: 'auto',
                    maxHeight: '400px',
                    padding: '16px',
                    marginTop: '16px',
                    marginBottom: '16px'
                  }}
                >
                  <pre id="json">
                    <code>
                      {JSON.stringify(transactionBuildValue?.decodedTransaction, null, 2)}
                    </code>
                  </pre>
                </Box>
              </BoxWrapperColumn>
            )}

            {transactionBuildStatus === ('failed' as SetupItemStatus) && !isLoading && (
              <BoxWrapperRow sx={{ justifyContent: 'flex-start' }}>
                <CustomTypography variant={'body2'} sx={{ color: 'red' }}>
                  {error?.message && typeof error?.message === 'string'
                    ? error?.message
                    : 'Error decoding transaction'}
                </CustomTypography>
              </BoxWrapperRow>
            )}
          </BoxWrapperColumn>
        </AccordionDetails>
      </AccordionWrapper>
    </BoxWrapperRow>
  )
}
