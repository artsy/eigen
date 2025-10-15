import { captureMessage } from "@sentry/react-native"
import { InfiniteDiscoveryArtwork } from "app/Scenes/InfiniteDiscovery/InfiniteDiscovery"
import { useEffect } from "react"

export const useArtworksTelemetry = (artworks: InfiniteDiscoveryArtwork[]) => {
  useEffect(() => {
    if (artworks.length < 5) {
      captureMessage(
        `[DiscoveryDailyUnderFetch]: Received ${artworks.length} initial artworks (expected 5)`,
        {
          level: "info",
          extra: {
            artworkCount: artworks.length,
            artworkIds: artworks.map((a) => a.internalID),
          },
        }
      )
    }
  }, [artworks.length])
}

export const captureArtworksTelemetry = (
  artworks: InfiniteDiscoveryArtwork[],
  excludeArtworkIds?: string[]
) => {
  if (artworks.length < 5) {
    const extra: Record<string, any> = {
      artworkCount: artworks.length,
      artworkIds: artworks.map((a) => a.internalID),
    }

    if (excludeArtworkIds) {
      extra.excludeArtworkIds = excludeArtworkIds
    }

    captureMessage(`[DiscoveryDailyUnderFetch]: Fetched ${artworks.length} artworks (expected 5)`, {
      level: "info",
      extra,
    })
  }
}
