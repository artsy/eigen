import { ArtworkGridItem_artwork } from "__generated__/ArtworkGridItem_artwork.graphql"
import { getTimerInfo } from "app/utils/saleTime"
import { Time, useTimer } from "app/utils/useTimer"
import moment, { Duration } from "moment"
import { Text } from "palette"

interface LotCloseInfoProps {
  saleArtwork: NonNullable<ArtworkGridItem_artwork["saleArtwork"]>
  sale: NonNullable<ArtworkGridItem_artwork["sale"]>
  duration: Duration | null
}

export const LotCloseInfo: React.FC<LotCloseInfoProps> = ({ saleArtwork, sale, duration }) => {
  const endTime = saleArtwork.extendedBiddingEndAt ?? saleArtwork.endAt

  const { hasEnded: lotHasClosed } = useTimer(endTime!, sale.startAt!)

  const { hasEnded: lotsAreClosing, hasStarted: saleHasStarted } = useTimer(
    sale.endAt!,
    sale.startAt!
  )

  const isWithinExtended = !!saleArtwork.extendedBiddingEndAt
    ? moment().isBefore(saleArtwork.extendedBiddingEndAt)
    : false

  if (!saleHasStarted || !duration) {
    return null
  }

  const time: Time = {
    days: duration.asDays().toString(),
    hours: duration.hours().toString(),
    minutes: duration.minutes().toString(),
    seconds: duration.seconds().toString(),
    startAt: "",
    endDate: "",
  }

  const timerCopy = getTimerInfo(time, { hasStarted: saleHasStarted })

  let lotCloseCopy
  let labelColor = "black60"

  // Lot has already closed
  if (lotHasClosed) {
    lotCloseCopy = "Closed"
  } else if (isWithinExtended) {
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
