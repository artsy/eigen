import { useCallback, useEffect, useRef } from "react"

/**
 * Returns a setTimeout that auto-clears on unmount. Use this when a delayed
 * callback would otherwise fire a ref command (`.focus()`, `.scrollTo()`, …)
 * on a view that may have been torn down — the JS-thread crash signature
 * for that race is `Scheduler::uiManagerDidDispatchCommand` in Fabric.
 */
export const useSafeTimeout = () => {
  const timeouts = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())

  useEffect(() => {
    const pending = timeouts.current
    return () => {
      pending.forEach(clearTimeout)
      pending.clear()
    }
  }, [])

  return useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(() => {
      timeouts.current.delete(id)
      fn()
    }, delay)
    timeouts.current.add(id)
    return id
  }, [])
}
