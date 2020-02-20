import { useMemo, useRef } from "react"

/**
 * like useCallback but the returned callback must be called twice in quick succession
 * to invoke the given callback.
 * @param cb
 */
export function useDoublePressCallback<T extends any[]>(cb: (...t: T) => void) {
  const lastPressTime = useRef(0)
  return useMemo(
    () => (...args: T) => {
      const now = Date.now()
      if (now - lastPressTime.current < 400) {
        lastPressTime.current = 0
        return cb(...args)
      } else {
        lastPressTime.current = now
      }
    },
    [cb]
  )
}
