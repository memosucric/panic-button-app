import * as React from 'react'
import { useApp } from 'src/contexts/app.context'
import ErrorBoundaryWrapper from 'src/components/ErrorBoundary/ErrorBoundaryWrapper'
import BoxContainerWrapper from 'src/components/Wrappers/BoxContainerWrapper'
import Loading from 'src/components/Loading'
import PaperSection from 'src/components/PaperSection'
import EmptyData from 'src/components/EmptyData'
import Detail from 'src/views/Position/Detail'

const WrappedPosition = () => {
  const { state } = useApp()
  const { positions } = state
  const { selectedValue, status } = positions

  return (
    <ErrorBoundaryWrapper>
      <BoxContainerWrapper>
        {status === 'loading' ? <Loading /> : null}
        {status === 'idle' ? (
          <PaperSection title="Position detail">
            {selectedValue ? <Detail selectedValue={selectedValue} /> : null}
            {!selectedValue ? <EmptyData /> : null}
          </PaperSection>
        ) : null}
      </BoxContainerWrapper>
    </ErrorBoundaryWrapper>
  )
}

export default WrappedPosition
