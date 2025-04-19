import { Text } from "@artsy/palette-mobile"
import { ArtworkAuctionTimer_collectorSignals$key } from "__generated__/ArtworkAuctionTimer_collectorSignals.graphql"
import { formattedTimeLeft } from "app/Scenes/Activity/utils/formattedTimeLeft"
import { getTimer } from "app/utils/getTimer"
import { DateTime } from "luxon"
import { useEffect, useRef, useState } from "react"
import { graphql, useFragment } from "react-relay"

interface ArtworkAuctionTimerProps {
  collectorSignals: ArtworkAuctionTimer_collectorSignals$key
  hideRegisterBySignal?: boolean
  inRailCard?: boolean
}

const INTERVAL = 1000

export const ArtworkAuctionTimer: React.FC<ArtworkAuctionTimerProps> = ({
  collectorSignals,
  hideRegisterBySignal,
  inRailCard,
}) => {
  const lineHeight = inRailCard ? "20px" : "18px"
  const data = useFragment(fragment, collectorSignals)
  const { lotClosesAt, onlineBiddingExtended, registrationEndsAt } = data.auction ?? {}

  const lotEndAt = DateTime.fromISO(lotClosesAt ?? "")
  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null)
  const [time, setTime] = useState(getTimer(lotClosesAt ?? "")["time"])

  useEffect(() => {
    intervalId.current = setInterval(() => {
      const { time: timerTime } = getTimer(lotClosesAt ?? "")

      setTime(timerTime)
    }, INTERVAL)

    return () => {
      if (intervalId.current) clearInterval(intervalId.current)
    }
  }, [])

  if (
    registrationEndsAt &&
    DateTime.fromISO(registrationEndsAt).diffNow().as("seconds") > 0 &&
    !hideRegisterBySignal
  ) {
    const formattedRegistrationEndsAt = DateTime.fromISO(registrationEndsAt).toFormat("MMM d")

    return (
      <Text lineHeight={lineHeight} variant="xs" numberOfLines={1} color="mono100">
        Register by {formattedRegistrationEndsAt}
      </Text>
    )
  }

  if (!lotClosesAt || lotEndAt.diffNow().as("days") > 5 || lotEndAt.diffNow().as("seconds") <= 0) {
    return null
  }

  const timerColor = lotEndAt.diffNow().as("hours") <= 1 ? "red100" : "blue100"
  const { timerCopy } = formattedTimeLeft(time)

  if (onlineBiddingExtended) {
    return (
      <Text lineHeight={lineHeight} variant="xs" numberOfLines={1} color={timerColor}>
        Extended, {timerCopy} left
        {inRailCard ? " to bid" : ""}
      </Text>
    )
  }

  return (
    <Text lineHeight={lineHeight} variant="xs" numberOfLines={1} color={timerColor}>
      {timerCopy} left to bid
    </Text>
  )
}

const fragment = graphql`
  fragment ArtworkAuctionTimer_collectorSignals on CollectorSignals {
    auction {
      onlineBiddingExtended
      lotClosesAt
      registrationEndsAt
    }
  }
`
