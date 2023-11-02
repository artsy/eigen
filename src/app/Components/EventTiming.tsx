import { Text, TextProps } from "@artsy/palette-mobile"
import { useEventTiming } from "app/utils/useEventTiming"

interface Props extends TextProps {
  startAt: string | null | undefined
  endAt: string | null | undefined
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
