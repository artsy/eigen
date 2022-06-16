import { ArtworkGridItem_artwork$data } from "__generated__/ArtworkGridItem_artwork.graphql"
import { getTimerInfo } from "app/utils/saleTime"
import { Time, useTimer } from "app/utils/useTimer"
import { Text } from "palette"
import { CountdownTimerProps } from "../Countdown/CountdownTimer"

interface LotCloseInfoProps {
  saleArtwork: NonNullable<ArtworkGridItem_artwork$data["saleArtwork"]>
  sale: NonNullable<ArtworkGridItem_artwork$data["sale"]>
  duration: CountdownTimerProps["duration"]

  /** Specific time lot sale ends, taking into account the current
   *  extendedBiddingEndAt received from the websocket which may be diffrent
   *  from the extendedBiddingEndAt you may find on saleArtwork
   */
  lotEndAt?: string
  hasBeenExtended: boolean
}

export const LotCloseInfo: React.FC<LotCloseInfoProps> = ({
  lotEndAt,
  hasBeenExtended,
  saleArtwork,
  sale,
  duration,
}) => {
  if (!lotEndAt) {
    return null
  }
  const { hasEnded: lotHasClosed } = useTimer(lotEndAt, sale.startAt ?? "")

  const { hasEnded: lotsAreClosing, hasStarted: saleHasStarted } = useTimer(
    sale.endAt!,
    sale.startAt!
  )

  if (!saleHasStarted || !duration) {
    return null
  }

  const time: Time = {
    days: duration.asDays().toString(),
    hours: duration.hours().toString(),
    minutes: duration.minutes().toString(),
    seconds: duration.seconds().toString(),
  }

  const timerCopy = getTimerInfo(time, { hasStarted: saleHasStarted })

  let lotCloseCopy
  let labelColor = "black60"

  // Lot has already closed
  if (lotHasClosed) {
    lotCloseCopy = "Closed"
  } else if (hasBeenExtended) {
    labelColor = "red100"
    lotCloseCopy = `Extended, ${timerCopy.copy}`
  } else if (saleHasStarted) {
    // Sale has started and lots are <24 hours from closing or are actively closing
    if (duration.asDays() < 1 || lotsAreClosing) {
      lotCloseCopy = `Closes, ${timerCopy.copy}`
      if (duration.hours() < 1 && duration.minutes() < sale.cascadingEndTimeIntervalMinutes!) {
        labelColor = "red100"
      } else {
        labelColor = "black100"
      }
    }
    // Sale has started but lots have not started closing
    else {
      lotCloseCopy = saleArtwork.formattedEndDateTime
    }
  }

  return (
    <Text variant="xs" color={labelColor}>
      {lotCloseCopy}
    </Text>
  )
}
