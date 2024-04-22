import { getTimer, Timer } from "app/utils/getTimer"
import { useEffect, useState } from "react"

const THE_PAST = new Date(0).toISOString()

export const useTimer = (endAt?: string | null): Timer | null => {
  const initialTimer = endAt ? getTimer(endAt ?? THE_PAST) : null

  const [timer, setTimer] = useState(initialTimer)

  // Update the timer as values change and time passes
  useEffect(() => {
    if (!endAt) {
      setTimer(null)
      return
    }

    if (!timer) {
      setTimer(initialTimer)
    }

    if (timer && !timer.hasEnded) {
      let interval = 1000 // default to 1 second

      if (parseInt(timer.time.days) > 0) {
        interval = 60 * 60 * 1000 // update every hour
      } else if (parseInt(timer.time.hours) > 0) {
        interval = 60 * 1000 // update every minute
      } else if (parseInt(timer.time.seconds) < 3) {
        interval = 200 // update quickly in the final seconds
      }

      const timeout = setTimeout(() => {
        setTimer(initialTimer)
      }, interval)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [endAt, timer])

  return timer
}
