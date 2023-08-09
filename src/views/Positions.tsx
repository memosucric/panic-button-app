import ErrorBoundaryWrapper from 'src/components/ErrorBoundary/ErrorBoundaryWrapper'
import React from 'react'
import PaperSection from 'src/components/PaperSection'
import { useApp } from 'src/contexts/app.context'
import TextLoading from 'src/components/TextLoading'
import CardList from 'src/views/Cards/CardList'
import EmptyData from 'src/components/EmptyData'

const Positions = () => {
  const { state } = useApp()
  const { positions } = state
  const { values, status } = positions

  return (
    <ErrorBoundaryWrapper>
      <PaperSection title="Positions">
        {values?.length > 0 && status === 'idle' ? <CardList positions={values} /> : null}
        {values?.length === 0 && status === 'idle' ? <EmptyData /> : null}
        {status === 'loading' ? <TextLoading /> : null}
      </PaperSection>
    </ErrorBoundaryWrapper>
  )
}

export default Positions
