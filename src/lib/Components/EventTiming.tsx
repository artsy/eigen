import { DateTime, Duration } from "luxon"
import { Text } from "palette"
import React from "react"

function padWithZero(num: number) {
  return num.toString().padStart(2, "0")
}

interface Props {
  startAt: string | null
  endAt: string | null
  currentTime: string
}

const SEPARATOR = <>&nbsp;:&nbsp;</>

export const EventTiming: React.FC<Props> = ({ currentTime, startAt, endAt }) => {
  if (!startAt || !endAt) {
    return null
  }

  const durationTilEnd = Duration.fromISO(DateTime.fromISO(endAt).diff(DateTime.fromISO(currentTime)).toString())
  const daysTilEnd = durationTilEnd.as("days")
  const secondsTilEnd = durationTilEnd.as("seconds")

  const hasStarted =
    Duration.fromISO(DateTime.fromISO(startAt).diff(DateTime.fromISO(currentTime)).toString()).seconds < 0
  const closesSoon = daysTilEnd <= 3 && daysTilEnd > 1
  const hasEnded = Math.floor(secondsTilEnd) <= 0
  const closesToday = daysTilEnd < 1 && !hasEnded

  return (
    <Text variant="mediumText">
      {!!hasEnded && "Closed"}
      {!hasStarted && "Opening Soon"}
      {!!closesSoon && `Closes in ${Math.ceil(daysTilEnd)} days`}
      {!!closesToday && (
        <>
          Closes in {padWithZero(Math.max(0, Math.floor(durationTilEnd.as("hours") % 24)))}
          {SEPARATOR}
          {padWithZero(Math.max(0, Math.floor(durationTilEnd.as("minutes") % 60)))}
          {SEPARATOR}
          {padWithZero(Math.max(0, Math.floor(secondsTilEnd % 60)))}
        </>
      )}
    </Text>
  )
}
