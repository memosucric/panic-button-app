import ErrorBoundaryWrapper from 'src/components/ErrorBoundary/ErrorBoundaryWrapper'
import React from 'react'
import PaperSection from 'src/components/PaperSection'
import { useApp } from 'src/contexts/app.context'
import List from 'src/views/Positions/List'
import EmptyData from 'src/components/EmptyData'
import BoxContainerWrapper from 'src/components/Wrappers/BoxContainerWrapper'
import Loading from 'src/components/Loading'

const WrapperPositions = () => {
  const { state } = useApp()
  const { positions } = state
  const { values, status } = positions

  return (
    <ErrorBoundaryWrapper>
      <BoxContainerWrapper>
        {status === 'loading' ? <Loading /> : null}
        {status === 'idle' ? (
          <PaperSection title="Positions">
            {values?.length > 0 ? <List positions={values} /> : null}
            {!values || values?.length === 0 ? <EmptyData /> : null}
          </PaperSection>
        ) : null}
      </BoxContainerWrapper>
    </ErrorBoundaryWrapper>
  )
}

export default WrapperPositions
