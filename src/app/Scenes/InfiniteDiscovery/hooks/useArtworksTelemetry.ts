import { InfiniteDiscoveryArtwork } from "app/Scenes/InfiniteDiscovery/InfiniteDiscovery"
import { volleyClient } from "app/utils/volleyClient"
import { useEffect } from "react"
import { getVersion } from "react-native-device-info"

export const useArtworksTelemetry = (artworks: InfiniteDiscoveryArtwork[]) => {
  useEffect(() => {
    if (artworks.length < 5) {
      captureArtworksTelemetry(artworks)
    }
  }, [artworks.length])
}

export const captureArtworksTelemetry = (
  artworks: InfiniteDiscoveryArtwork[],
  excludeArtworkIds?: string[]
) => {
  volleyClient.send({
    type: "increment",
    name: "discovery-daily-less-than-5",
    tags: [
      `arworkCount: ${artworks.length}`,
      `arworkIds: ${artworks.map((a) => a.internalID).join(",")}`,
      `appVersion: ${getVersion()}`,
      `excludeArtworkCount: ${excludeArtworkIds?.length}`,
      `excludeArtworkIds: ${excludeArtworkIds?.join(",")}`,
    ],
  })
}
