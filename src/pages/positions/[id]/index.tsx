import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import * as React from 'react'
import { ReactElement } from 'react'
import PageLayout from 'src/components/Layout/Layout'
import { useApp } from 'src/contexts/app.context'
import ExtractAction from 'src/components/ButtonActions/Extract'

interface PositionProps {
  cardId: string
}

const Index = (props: PositionProps): ReactElement => {
  const { cardId } = props

  const { state } = useApp()

  const { positions } = state
  const { values } = positions
  const card = values.find((position) => position?.id?.toLowerCase() === cardId?.toLowerCase())

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        gap={2}
      >
        {card?.position}
        <ExtractAction />
      </Box>
    </Container>
  )
}

Index.getTitle = 'Position'

Index.getLayout = (page: ReactElement) => <PageLayout>{page}</PageLayout>

export default Index

export async function getServerSideProps(ctx: any) {
  const { params: { id = '' } = {} } = ctx

  return {
    props: {
      cardId: id
    }
  }
}
