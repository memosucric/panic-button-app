import ErrorBoundaryWrapper from 'src/components/ErrorBoundary/ErrorBoundaryWrapper'
import BoxContainerWrapper from 'src/components/Wrappers/BoxContainerWrapper'
import React from 'react'
import CardList from 'src/views/Cards/CardList'
import EmptyData from 'src/components/EmptyData'
import PaperSection from 'src/components/PaperSection'

interface PositionsProps {
  positions: any[]
}

const Positions = ({ positions }: PositionsProps) => {
  return (
    <ErrorBoundaryWrapper>
      <BoxContainerWrapper>
        <PaperSection title="Positions">
          {positions?.length > 0 ? <CardList tokenDetailByPosition={positions} /> : <EmptyData />}
        </PaperSection>
      </BoxContainerWrapper>
    </ErrorBoundaryWrapper>
  )
}

export default Positions
