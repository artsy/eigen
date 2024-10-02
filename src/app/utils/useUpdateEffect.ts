import { useEffect, useRef } from "react"

/**
 * Equivalent to `useEffect` but skips initial mount
 */
export const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const didMountRef = useRef(false)

  useEffect(() => {
    if (didMountRef.current) {
      return effect()
    }

    didMountRef.current = true
  }, deps)
}
