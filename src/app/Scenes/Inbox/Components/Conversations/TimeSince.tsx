import { Box, BoxProps, Text, TextProps } from "@artsy/palette-mobile"
import { DateTime } from "luxon"
import { ViewStyle } from "react-native"

const exactDate = (time: string) => {
  if (!time) {
    return null
  }
  const date = DateTime.fromISO(time)
  const now = DateTime.now()
  const isToday = date.hasSame(now, "day")
  const isYesterday = date.hasSame(now.minus({ days: 1 }), "day")
  const daysSince = Math.floor(now.diff(date, "days").days)

  if (isToday) {
    return `Today ${date.toFormat("h:mm A")}`
  } else if (isYesterday) {
    return `Yesterday ${date.toFormat("h:mm A")}`
  } else if (daysSince < 7) {
    return date.toFormat("EEEE h:mmA")
  } else {
    return date.toFormat("EEE, MMM d, h:mm A")
  }
}

export const relativeDate = (time: string) => {
  if (!time) {
    return null
  }
  const date = DateTime.fromISO(time)
  return date.toRelative()
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
