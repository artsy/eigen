import { useEffect, useRef } from "react"

/**
 * usePrevious
 * Stores state or props in a ref to compare against new props or state
 */
export function usePrevious(value) {
  const ref = useRef(value)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}
