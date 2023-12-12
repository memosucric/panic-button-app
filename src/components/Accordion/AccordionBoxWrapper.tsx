import { styled } from '@mui/material'
import BoxWrapperRow from '../Wrappers/BoxWrapperRow'

export const AccordionBoxWrapper = styled(BoxWrapperRow)(() => ({
  backgroundColor: '#eeeded',
  minHeight: '48px',
  borderBottomLeftRadius: '4px',
  borderBottomRightRadius: '4px',
  borderTopLeftRadius: '4px',
  borderTopRightRadius: '4px',
  padding: '0px 16px'
}))
