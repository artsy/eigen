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

export const ArtworkAuctionTimer: React.FC<ArtworkAuctionTimerProps> = ({
  collectorSignals,
  hideRegisterBySignal,
  inRailCard,
}) => {
  const lineHeight = inRailCard ? "20px" : "18px"
  const data = useFragment(fragment, collectorSignals)
  const { lotClosesAt, onlineBiddingExtended, registrationEndsAt } = data.auction ?? {}

  const lotEndAt = DateTime.fromISO(lotClosesAt ?? "")

  if (
    registrationEndsAt &&
    DateTime.fromISO(registrationEndsAt).diffNow().as("seconds") > 0 &&
    !hideRegisterBySignal
  ) {
    return (
      <AuctionTimerRegisterBy lineHeight={lineHeight} registrationEndsAt={registrationEndsAt} />
    )
  }

  if (!lotClosesAt || lotEndAt.diffNow().as("days") > 5 || lotEndAt.diffNow().as("seconds") <= 0) {
    return null
  }

  return (
    <AuctionTimerBid
      lineHeight={lineHeight}
      onlineBiddingExtended={onlineBiddingExtended}
      lotEndAt={lotEndAt}
      lotClosesAt={lotClosesAt}
      inRailCard={inRailCard}
    />
  )
}

const AuctionTimerRegisterBy: React.FC<{
  lineHeight: "20px" | "18px"
  registrationEndsAt: string
}> = ({ lineHeight, registrationEndsAt }) => {
  const formattedRegistrationEndsAt = DateTime.fromISO(registrationEndsAt).toFormat("MMM d")

  return (
    <Text lineHeight={lineHeight} variant="xs" numberOfLines={1} color="mono100">
      Register by {formattedRegistrationEndsAt}
    </Text>
  )
}

const AuctionTimerBid: React.FC<{
  lineHeight: "20px" | "18px"
  onlineBiddingExtended?: boolean
  inRailCard?: boolean
  lotEndAt: DateTime
  lotClosesAt: string
}> = ({ lineHeight, onlineBiddingExtended, inRailCard, lotEndAt, lotClosesAt }) => {
  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null)
  const [time, setTime] = useState(getTimer(lotClosesAt ?? "")["time"])

  useEffect(() => {
    // Do not update the timer if the lot is closing in longer than an hour
    if (lotEndAt.diffNow().as("hours") > 1 && !onlineBiddingExtended) {
      return
    }

    // Update the timer every second if the lot is closing in less than 5 minute, otherwise update every minute
    const interval = lotEndAt.diffNow().as("minutes") < 5 ? 1000 : 60000

    intervalId.current = setInterval(() => {
      const { time: timerTime } = getTimer(lotClosesAt ?? "")

      setTime(timerTime)
    }, interval)

    return () => {
      if (intervalId.current) clearInterval(intervalId.current)
    }
  }, [lotClosesAt])

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
