import { useInterval } from "lib/utils/useInterval"
import { DateTime } from "luxon"
import { useState } from "react"

export const useCurrentTime = (currentTime: DateTime) => {
  const [now, setNow] = useState(currentTime ? DateTime.fromISO(currentTime.toString()) : DateTime.local())

  useInterval(() => {
    setNow(currentTime ? DateTime.fromISO(currentTime.toString()) : DateTime.local())
  }, 1000)

  return now
}
