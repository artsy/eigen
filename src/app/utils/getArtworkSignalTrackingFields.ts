import { TappedMainArtworkGrid } from "@artsy/cohesion"
import { LargeArtworkRail_artworks$data } from "__generated__/LargeArtworkRail_artworks.graphql"

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
  const { auction, primaryLabel } = collectorSignals

  if (auctionSignalsFeatureFlagEnabled && auction) {
    const { bidCount, lotWatcherCount } = auction

    artworkTrackingSignalLabels.signal_bid_count = bidCount
    artworkTrackingSignalLabels.signal_lot_watcher_count = lotWatcherCount
  }

  let signal_label = ""

  switch (primaryLabel) {
    case "PARTNER_OFFER":
      signal_label = "Limited-Time Offer"
      break
    case "CURATORS_PICK":
      signal_label = "Curators' Pick"
      break
    case "INCREASED_INTEREST":
      signal_label = "Increased Interest"
      break
  }

  artworkTrackingSignalLabels.signal_label = signal_label

  return artworkTrackingSignalLabels
}
