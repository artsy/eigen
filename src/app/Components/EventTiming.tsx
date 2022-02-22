import { useEventTiming } from "app/utils/useEventTiming"
import { Text, TextProps } from "palette"
import React from "react"

interface Props extends TextProps {
  startAt: string | null
  endAt: string | null
  currentTime: string
}

export const EventTiming: React.FC<Props> = ({ currentTime, startAt, endAt, ...rest }) => {
  const { formattedTime } = useEventTiming({
    currentTime,
    startAt: startAt ?? undefined,
    endAt: endAt ?? undefined,
  })

  return (
    <Text variant="sm" {...rest}>
      {formattedTime}
    </Text>
  )
}
