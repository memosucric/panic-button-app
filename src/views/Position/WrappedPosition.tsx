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
  const { selectedPosition: position, status } = state
  const title = `${position?.lptoken_name} position details` ?? 'Card detail'

  return (
    <ErrorBoundaryWrapper>
      <BoxContainerWrapper>
        {status === 'Loading' ? <Loading /> : null}
        {status === 'Finished' ? (
          <PaperSection title={title}>
            {position ? <Detail position={position} /> : null}
            {!position ? <EmptyData /> : null}
          </PaperSection>
        ) : null}
      </BoxContainerWrapper>
    </ErrorBoundaryWrapper>
  )
}

export default WrappedPosition
