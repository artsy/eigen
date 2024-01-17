import { Stopwatch, Flex, Text } from "@artsy/palette-mobile"
import { ActivityItem_item$data } from "__generated__/ActivityItem_item.graphql"
import { formattedTimeLeft } from "app/Scenes/Activity/utils/formattedTimeLeft"
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
      if (intervalId.current) clearInterval(intervalId.current)
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
