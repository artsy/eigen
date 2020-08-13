import { DateTime } from "luxon"
import React from "react"
import { ProgressBar } from ".."
import { color } from "../../helpers"

/** ProgressBarTimer */
export const ProgressBarTimer: React.SFC<{
  currentTime: string | DateTime
  countdownStart: string
  countdownEnd: string
  highlight: Parameters<typeof color>[0]
}> = ({
  currentTime,
  countdownStart,
  countdownEnd,
  highlight = "purple100",
}) => {
  const secondsRemaining = DateTime.fromISO(countdownEnd).diff(
    DateTime.fromISO(currentTime.toString()),
    "seconds"
  ).seconds
  const totalSeconds = DateTime.fromISO(countdownEnd).diff(
    DateTime.fromISO(countdownStart),
    "seconds"
  ).seconds
  const progress = Math.max(0, (secondsRemaining * 100) / totalSeconds)

  return <ProgressBar percentComplete={progress} highlight={highlight as any} />
}
