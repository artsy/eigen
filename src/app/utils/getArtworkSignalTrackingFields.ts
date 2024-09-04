import { TappedMainArtworkGrid } from "@artsy/cohesion"
import { LargeArtworkRail_artworks$data } from "__generated__/LargeArtworkRail_artworks.graphql"
import { isEmpty } from "lodash"
import { DateTime } from "luxon"

export type CollectorSignals = LargeArtworkRail_artworks$data[0]["collectorSignals"]

type ArtworkSignalTrackingFields = Pick<
  TappedMainArtworkGrid,
  "signal_label" | "signal_bid_count" | "signal_lot_watcher_count"
>

export const getArtworkSignalTrackingFields = (
  collectorSignals: CollectorSignals,
  auctionSignalsFeatureFlagEnabled?: boolean
): ArtworkSignalTrackingFields => {
  if (!collectorSignals) {
    return {}
  }

  const artworkTrackingSignalLabels: ArtworkSignalTrackingFields = {}

  let signal_label = ""
  const { partnerOffer, auction } = collectorSignals

  if (!isEmpty(partnerOffer)) {
    signal_label = "Limited-Time Offer"
  }

  if (auctionSignalsFeatureFlagEnabled && auction) {
    const { bidCount, liveBiddingStarted, lotClosesAt, lotWatcherCount, registrationEndsAt } =
      auction

    const registrationEnded =
      registrationEndsAt && DateTime.fromISO(registrationEndsAt).diffNow().as("seconds") <= 0

    const lotEndAt = !!lotClosesAt && DateTime.fromISO(lotClosesAt)

    if (
      !!registrationEnded &&
      lotEndAt &&
      lotEndAt.diffNow().as("days") <= 5 &&
      lotEndAt.diffNow().as("seconds") > 0
    ) {
      signal_label = "Time left to bid"
    }

    if (liveBiddingStarted) {
      signal_label = "Bidding live now"
    }

    artworkTrackingSignalLabels.signal_bid_count = bidCount
    artworkTrackingSignalLabels.signal_lot_watcher_count = lotWatcherCount
  }

  artworkTrackingSignalLabels.signal_label = signal_label

  return artworkTrackingSignalLabels
}
