import { Box } from '@mui/material'
import { Variants, motion, useAnimation } from 'framer-motion'
import * as React from 'react'
import { useInView } from 'react-intersection-observer'
import Card from 'src/views/Positions/Card'
import { PositionType } from 'src/contexts/types'

interface ListProps {
  positions: PositionType[]
}

const List = (props: ListProps) => {
  const { positions } = props

  const [ref, inView] = useInView()
  const controls = useAnimation()

  React.useEffect(() => {
    if (inView) {
      controls.start('visible')
    } else {
      controls.stop()
    }
  }, [inView, controls, positions])

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.05
      }
    }
  }

  const itemVariants: Variants = {
    hidden: {
      y: 50,
      opacity: 0
    },
    visible: ({ index }: any) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: 'ease-in-out',
        delay: 0.15 * index
      }
    })
  }

  return (
    <Box
      ref={ref}
      component={motion.div}
      initial={'hidden'}
      animate={controls}
      variants={containerVariants}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '20px 20px'
      }}
    >
      {positions.map((position: PositionType, index: number) => {
        return (
          <Box
            component={motion.div}
            key={index}
            variants={itemVariants}
            custom={{ index }}
            sx={{
              width: '280px',
              minHeight: '140px',
              maxHeight: '200px',
              padding: '12px 12px',
              border: '1px solid #B6B6B6',
              background: 'background.paper',
              borderRadius: '8px'
            }}
          >
            <Card id={index} key={index} position={position} />
          </Box>
        )
      })}
    </Box>
  )
}

export default List
