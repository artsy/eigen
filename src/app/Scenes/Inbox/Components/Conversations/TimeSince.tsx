import { Box, BoxProps, Text, TextProps } from "@artsy/palette-mobile"
import moment from "moment"
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
  variant?: TextProps["variant"]
  time: string | null | undefined
  exact?: boolean
  style?: ViewStyle
}
export const TimeSince: React.FC<TimeSinceProps> = ({ variant = "xs", time, exact, ...props }) => {
  if (!time) {
    return null
  }
  return (
    <Box {...props}>
      <Text variant={variant} color="mono60">
        {exact ? exactDate(time) : relativeDate(time)}
      </Text>
    </Box>
  )
}
