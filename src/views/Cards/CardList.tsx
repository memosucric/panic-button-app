import { Box } from '@mui/material'
import { Variants, motion, useAnimation } from 'framer-motion'
import * as React from 'react'
import { useInView } from 'react-intersection-observer'
import Card from 'src/views/Cards/Card/Card'
import { PositionType } from 'src/contexts/types'
import Link from 'next/link'

interface CardListProps {
  positions: PositionType[]
}

const CardList = (props: CardListProps) => {
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
        alignContent: 'center',
        gap: '20px 20px'
      }}
    >
      {positions.map((card: any, index: number) => {
        return (
          <Box
            component={motion.div}
            key={index}
            variants={itemVariants}
            custom={{ index }}
            sx={{
              width: '340px',
              minHeight: '140px',
              maxHeight: '340px',
              padding: '8px 8px',
              border: '1px solid #B6B6B6',
              background: 'background.paper'
            }}
          >
            <Link href={`/positions/${card.id}`} style={{ textDecoration: 'none' }}>
              <Card id={index} key={index} card={card} />
            </Link>
          </Box>
        )
      })}
    </Box>
  )
}

export default CardList
