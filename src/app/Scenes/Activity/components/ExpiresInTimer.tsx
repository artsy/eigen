import { Stopwatch, Flex, Text } from "@artsy/palette-mobile"
import { ActivityItem_item$data } from "__generated__/ActivityItem_item.graphql"
import { Time, getTimer } from "app/utils/getTimer"
import { useEffect, useRef, useState } from "react"

const INTERVAL = 1000

export const ExpiresInTimer: React.FC<{ expiresAt: string }> = ({ expiresAt }) => {
  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null)

  const [time, setTime] = useState<Time>(getTimer(expiresAt)["time"])
  const [hasEnded, setHasEnded] = useState(getTimer(expiresAt)["hasEnded"])

  useEffect(() => {
    intervalId.current = setInterval(() => {
      const { hasEnded: timerHasEnded, time: timerTime } = getTimer(expiresAt)

      setHasEnded(timerHasEnded)
      setTime(timerTime)
    }, INTERVAL)

    return () => {
      // @ts-expect-error PLEASE_FIX_ME_STRICT_NULL_CHECK_MIGRATION
      clearInterval(intervalId.current)
    }
  }, [])

  if (hasEnded) {
    return (
      <Flex flexDirection="row" alignItems="center">
        <Stopwatch fill="red100" height={15} width={15} mr="2px" ml="-2px" />

        <Text variant="xs" color="red100">
          Expired
        </Text>
      </Flex>
    )
  }

  const formattedTimeLeft = (time: {
    days: string
    hours: string
    minutes: string
    seconds: string
  }) => {
    const parsedDays = parseInt(time.days, 10)
    const parsedHours = parseInt(time.hours, 10)
    const parsedMinutes = parseInt(time.minutes, 10)
    const parsedSeconds = parseInt(time.seconds, 10)

    let textColor = "blue100"
    let copy

    if (parsedDays >= 1) {
      copy = `${parsedDays} days`
    } else if (parsedDays < 1 && parsedHours >= 1) {
      copy = `${parsedHours} hours`
    } else if (parsedHours < 1 && parsedMinutes >= 1) {
      copy = `${parsedMinutes} minutes`
      textColor = "red100"
    } else if (parsedMinutes < 1) {
      copy = `${parsedSeconds} seconds`
      textColor = "red100"
    }

    return { timerCopy: copy, textColor }
  }

  const { timerCopy, textColor } = formattedTimeLeft(time)

  return (
    <Flex flexDirection="row" alignItems="center">
      <Stopwatch fill={textColor} height={15} width={15} mr="2px" />

      <Text variant="xs" color={textColor}>
        Expires in {timerCopy}
      </Text>
    </Flex>
  )
}

export const shouldDisplayExpiresInTimer = (item: ActivityItem_item$data) => {
  return item.notificationType === "PARTNER_OFFER_CREATED" && item?.item?.expiresAt
}
