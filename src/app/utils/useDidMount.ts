import { useEffect, useRef } from "react"

export const useDidMount = () => {
  const isMountedRef = useRef(false)
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])
  return isMountedRef
}
