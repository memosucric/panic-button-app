import * as React from 'react'
import { styled } from '@mui/system'

const TypingAnimated = styled('span')({
  'clip-path': 'inset(0 3ch 0 0)',
  '@keyframes typing': {
    to: {
      'clip-path': 'inset(0 -1ch 0 0)'
    }
  },
  animation: 'typing 2s steps(4) infinite'
})

const TextLoadingDots = () => {
  return <TypingAnimated>...</TypingAnimated>
}

export default TextLoadingDots
