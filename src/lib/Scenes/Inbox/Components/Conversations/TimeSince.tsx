import moment from "moment"
import { Box, BoxProps, Sans, SansSize } from "palette"
import React from "react"
import { ViewStyle } from "react-native"

const exactDate = (time: string) => {
  if (!time) {
    return null
  }
  const date = moment(time)
  const isToday = moment().isSame(date, "day")
  const isYesterday = moment().subtract(1, "days").isSame(date, "day")
  const daysSince = moment().diff(date, "days")

  if (isToday) {
    return date.format("[Today] h:mm A")
  } else if (isYesterday) {
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
  style?: ViewStyle
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
