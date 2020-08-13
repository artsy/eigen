import { DateTime } from "luxon"
import { useState } from "react"
import { useInterval } from "./useInterval"

/**
 * useCurrentTime
 */
export function useCurrentTime(currentTime) {
  const [now, setNow] = useState(
    currentTime ? DateTime.fromISO(currentTime.toString()) : DateTime.local()
  )

  useInterval(() => {
    setNow(
      currentTime ? DateTime.fromISO(currentTime.toString()) : DateTime.local()
    )
  }, 1000)

  return now
}
