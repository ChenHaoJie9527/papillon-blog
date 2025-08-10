import { useRef } from 'react'

export default function useIsFirstRender() {
  const isFirstRender = useRef(true)

  if (isFirstRender.current === true) {
    isFirstRender.current = false
    return true
  }

  return false
}
