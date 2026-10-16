import { useEffect, useRef, useState } from "react"

/**
 * Delays *showing* by `delay`, and hides immediately.
 *
 * `useDebouncedValue` delays in both directions, which is what made popovers appear on
 * screens we had already left: the value was captured when the timer started and never
 * re-checked when it fired. Here the predicate is called again at fire time, so a
 * condition that stopped holding during the delay never shows.
 */
export const useShowDelay = (predicate: () => boolean, delay: number) => {
  const [isShown, setIsShown] = useState(false)
  const predicateRef = useRef(predicate)
  predicateRef.current = predicate

  const shouldShow = predicate()

  useEffect(() => {
    if (!shouldShow) {
      // Hiding is never delayed: a popover that should go away has to go away now.
      setIsShown(false)
      return
    }

    if (!delay) {
      setIsShown(true)
      return
    }

    const timeout = setTimeout(() => {
      // Re-check rather than trusting the value we captured when the timer started.
      setIsShown(predicateRef.current())
    }, delay)

    return () => clearTimeout(timeout)
  }, [shouldShow, delay])

  return isShown
}
