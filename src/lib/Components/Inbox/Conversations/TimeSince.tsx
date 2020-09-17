import moment from "moment"
import { Box, BoxProps, Sans, SansSize } from "palette"
import React from "react"

const exactDate = (time: string) => {
  if (!time) {
    return null
  }
  const date = moment(time)
  const daysSince = moment().diff(date, "days")
  if (daysSince === 0) {
    return date.format("[Today] h:mm A")
  } else if (daysSince === 1) {
    return date.format("[Yesterday] h:mm A")
  } else if (daysSince < 7) {
    return date.format("dddd h:mmA")
  } else {
    return date.format("ddd, MMM Do, h:mm A")
  }
}

export const relativeDate = (time: string) => {
  if (!time) {
    return null
  }
  const date = moment(time)
  return date.fromNow()
}

interface TimeSinceProps extends Omit<BoxProps, "color"> {
  size?: SansSize
  time: string | null
  exact?: boolean
  style?: any // FIXME: React.CSSProperties
}
export const TimeSince: React.FC<TimeSinceProps> = ({ size = "2", time, exact, ...props }) => {
  if (!time) {
    return null
  }
  return (
    <Box {...props}>
      <Sans size={size} color="black30">
        {exact ? exactDate(time) : relativeDate(time)}
      </Sans>
    </Box>
  )
}
