import BoxWrapperRow from 'src/components/Wrappers/BoxWrapperRow'
import {AccordionSummary, Alert, Box, Table, TableBody, TableCell, TableContainer, TableRow} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CustomTypography from 'src/components/CustomTypography'
import AccordionDetails from '@mui/material/AccordionDetails'
import * as React from 'react'
import {AccordionWrapper} from 'src/components/Accordion/AccordionWrapper'
import {useApp} from "src/contexts/app.context"
import {useMutation} from "react-query"
import BoxWrapperColumn from "src/components/Wrappers/BoxWrapperColumn"
import Loading from "src/components/Loading"
import {setStrategyStatus, setStrategyTransactionBuild, setStrategyTransactionCheck} from "src/contexts/reducers";
import {ExecuteStrategyStatus, TransactionBuild} from "src/contexts/state";
import {shortenAddress} from "src/utils/string";

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

const fetchTransactionDetail = async (parameters: any) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parameters),
  };

  const response = await fetch('/api/execute', options)

  if (!response.ok) {
    throw new Error('Failed to execute transaction details')
  }

  const data = await response.json()
  return data
}

export const TransactionDetails = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {dispatch, state} = useApp()

  const {strategy} = state
  const {create, transactionBuild, status} = strategy

  const {mutate, isLoading, isError, error} = useMutation({
    mutationFn: fetchTransactionDetail,
    onSuccess: (body) => {
      const {transaction, decoded_transaction: decodedTransaction} = body?.data ?? {}
      dispatch(setStrategyTransactionBuild({transaction, decodedTransaction} as TransactionBuild))
      dispatch(setStrategyStatus('transaction_build' as ExecuteStrategyStatus))

      const isTransactionChecked = !!transaction && !!decodedTransaction
      dispatch(setStrategyTransactionCheck(isTransactionChecked))
      if (isTransactionChecked) {
        dispatch(setStrategyStatus('transaction_check' as ExecuteStrategyStatus))
      }

    },
    onError: (error) => {
      dispatch(setStrategyStatus('transaction_build' as ExecuteStrategyStatus))
      dispatch(setStrategyTransactionCheck(false))
    }
  })

  React.useEffect(() => {
    if (!create) return

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
    } = create

    mutate({
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
    })
  }, [create])

  const parameters = React.useMemo(() => {
    if (!transactionBuild) return []
    const {transaction} = transactionBuild

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
      .filter(({value}) => value)
  }, [transactionBuild])


  return (
    <BoxWrapperRow gap={2} sx={{m: 3, backgroundColor: 'custom.grey.light'}}>
      <AccordionWrapper sx={{width: '100%'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon/>}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <CustomTypography variant={'body2'}>Transaction details</CustomTypography>
        </AccordionSummary>
        <AccordionDetails sx={{justifyContent: 'flex-start', display: 'flex'}}>
          <BoxWrapperColumn sx={{width: '100%'}} gap={2}>
            {isLoading && <Loading minHeight={'120px'}/>}
            {transactionBuild && parameters?.length > 0 && (
              <>
                <TableContainer>
                  <Table sx={{minWidth: 350}}>
                    <TableBody>
                      {parameters.map(({label, value, key}, index) => {
                        if (!value || !label) return null

                        return (
                          <TableRow
                            key={index}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                          >
                            <TableCell component="th" scope="row">
                              {label}
                            </TableCell>
                            <TableCell align="right">
                              {key === 'to' || key === 'from' ?
                                <span title={value}>{shortenAddress(value)}</span> : value}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
            {transactionBuild && transactionBuild?.decodedTransaction &&
              (
                <BoxWrapperColumn sx={{
                  width: 'fit-content',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  fontSize: '0.8rem'
                }}>
                  <CustomTypography variant={'body2'}>
                    Decoded Transaction
                  </CustomTypography>
                  <Box>
                    <pre id="json">
                      <code>{JSON.stringify(transactionBuild?.decodedTransaction, null, 2)}</code>
                    </pre>
                  </Box>
                </BoxWrapperColumn>
              )
            }

            {isError && (
              <BoxWrapperRow>
                <Alert severity="error">Error: {error.message}</Alert>
              </BoxWrapperRow>
            )}
          </BoxWrapperColumn>
        </AccordionDetails>
      </AccordionWrapper>
    </BoxWrapperRow>
  )
}
