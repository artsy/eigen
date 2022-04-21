import { ArtworkGridItem_artwork } from "__generated__/ArtworkGridItem_artwork.graphql"
import { useTimer } from "app/utils/useTimer"
import { Duration } from "moment"
import { Text } from "palette"
import { getTimerInfo } from "../Countdown/Ticker"

interface LotCloseInfoProps {
  saleArtwork: NonNullable<ArtworkGridItem_artwork["saleArtwork"]>
  sale: NonNullable<ArtworkGridItem_artwork["sale"]>
  duration: Duration | null
}

export const LotCloseInfo: React.FC<LotCloseInfoProps> = ({ saleArtwork, sale, duration }) => {
  const { hasEnded: lotHasClosed } = useTimer(saleArtwork.endAt!, sale.startAt!)

  const { hasEnded: lotsAreClosing, hasStarted: saleHasStarted } = useTimer(
    sale.endAt!,
    sale.startAt!
  )

  if (!saleHasStarted || !duration) {
    return null
  }

  const timerCopy = getTimerInfo(duration, saleHasStarted)

  let lotCloseCopy
  let labelColor = "black60"

  // Lot has already closed
  if (lotHasClosed) {
    lotCloseCopy = "Closed"
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
