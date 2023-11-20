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
  const { selectedValue: position, status } = positions

  const title = position?.lptoken_name ?? 'Card detail'

  return (
    <ErrorBoundaryWrapper>
      <BoxContainerWrapper>
        {status === 'loading' ? <Loading /> : null}
        {status === 'idle' ? (
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
