import { Stopwatch, Flex, Text } from "@artsy/palette-mobile"
import { ActivityItem_notification$data } from "__generated__/ActivityItem_notification.graphql"
import { formattedTimeLeft } from "app/Scenes/Activity/utils/formattedTimeLeft"
import { Time, getTimer } from "app/utils/getTimer"
import { DateTime } from "luxon"
import { FC, useEffect, useRef, useState } from "react"

interface ExpiresInTimerProps {
  // TOFIX: this should have it's own relay fragment, no prop drilling with relay data!
  item: ActivityItem_notification$data["item"]
}

const WatchIcon: FC<{ fill?: string }> = ({ fill = "red100" }) => {
  return <Stopwatch fill={fill} height={15} width={15} mr="2px" />
}

export const ExpiresInTimer: FC<ExpiresInTimerProps> = ({ item }) => {
  // @ts-ignore: fix ExpiresInTimer fragment data
  const expiresAt = item?.expiresAt ?? ""
  // @ts-ignore: fix ExpiresInTimer fragment data
  const available = item?.available ?? false

  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null)

  const [time, setTime] = useState<Time>(getTimer(expiresAt)["time"])
  const [hasEnded, setHasEnded] = useState(getTimer(expiresAt)["hasEnded"])

  useEffect(() => {
    const expiresInLongerThanOneHour = DateTime.fromISO(expiresAt ?? "").diffNow()

    if (expiresInLongerThanOneHour) {
      // We do not want to update the timer if the offer is expiring in longer than an hour
      return
    }

    const interval =
      DateTime.fromISO(expiresAt ?? "")
        .diffNow()
        .as("minutes") < 5
        ? 1000
        : 60000

    intervalId.current = setInterval(() => {
      const { hasEnded: timerHasEnded, time: timerTime } = getTimer(expiresAt)

      setHasEnded(timerHasEnded)
      setTime(timerTime)
    }, interval)

    return () => {
      if (intervalId.current) clearInterval(intervalId.current)
    }
  }, [])

  if (!available) {
    return (
      <Flex flexDirection="row" alignItems="center">
        <WatchIcon />

        <Text variant="xs" color="red100">
          No longer available
        </Text>
      </Flex>
    )
  }

  if (hasEnded) {
    return (
      <Flex flexDirection="row" alignItems="center">
        <WatchIcon />

        <Text variant="xs" color="red100">
          Expired
        </Text>
      </Flex>
    )
  }

  const { timerCopy, textColor } = formattedTimeLeft(time)

  return (
    <Flex flexDirection="row" alignItems="center">
      <WatchIcon fill={textColor} />

      <Text variant="xs" color={textColor}>
        Expires in {timerCopy}
      </Text>
    </Flex>
  )
}

export const shouldDisplayExpiresInTimer = (
  notificationType: string,
  item: ActivityItem_notification$data["item"]
) => {
  // @ts-ignore: fix ExpiresInTimer fragment data
  return notificationType === "PARTNER_OFFER_CREATED" && item?.expiresAt
}
