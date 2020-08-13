import { DateTime, Duration } from "luxon"
import React from "react"
import { Flex, Sans } from "../"
import { color } from "../../helpers"
import { SansSize } from "../../Theme"
import { useCurrentTime } from "../../utils/useCurrentTime"

function padWithZero(num: number) {
  return num.toString().padStart(2, "0")
}

/** TimeRemaining */
export const TimeRemaining: React.SFC<{
  countdownEnd: string
  currentTime?: string | DateTime
  highlight: Parameters<typeof color>[0]
  labelFontSize?: SansSize
  labelWithoutTimeRemaining?: string
  labelWithTimeRemaining?: string
  timeEndedDisplayText?: string
  timerFontSize?: SansSize
  trailingText?: string
}> = ({
  countdownEnd,
  currentTime,
  highlight = "purple100",
  labelFontSize = "3",
  labelWithoutTimeRemaining,
  labelWithTimeRemaining,
  timeEndedDisplayText,
  timerFontSize = "3",
  trailingText,
}) => {
  const duration = Duration.fromISO(
    DateTime.fromISO(countdownEnd)
      .diff(useCurrentTime(currentTime))
      .toString()
  )

  const hasEnded = Math.floor(duration.seconds) <= 0

  const days = `${padWithZero(Math.max(0, Math.floor(duration.as("days"))))}d `
  const hours = `${padWithZero(
    Math.max(0, Math.floor(duration.as("hours") % 24))
  )}h `
  const minutes = `${padWithZero(
    Math.max(0, Math.floor(duration.as("minutes") % 60))
  )}m `
  const seconds = `${padWithZero(
    Math.max(0, Math.floor(duration.as("seconds") % 60))
  )}s`

  return (
    <Flex flexDirection="column" alignItems="center">
      <Sans size={timerFontSize} color={highlight} weight="medium">
        {hasEnded && timeEndedDisplayText ? (
          timeEndedDisplayText
        ) : (
          <>
            {days}
            {hours}
            {minutes}
            {seconds}
            {trailingText && ` ${trailingText}`}
          </>
        )}
      </Sans>
      {(labelWithTimeRemaining || labelWithoutTimeRemaining) && (
        <Sans size={labelFontSize} weight="medium">
          {hasEnded ? labelWithoutTimeRemaining : labelWithTimeRemaining}
        </Sans>
      )}
    </Flex>
  )
}
