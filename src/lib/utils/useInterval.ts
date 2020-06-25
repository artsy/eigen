import { useEffect, useRef } from "react"

export function useInterval(callback: () => any, delay: number) {
  const savedCallback = useRef<() => any>()

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    function tick() {
      savedCallback.current?.()
    }

    const id = setInterval(tick, delay)
    return () => clearInterval(id)
  }, [delay])
}
