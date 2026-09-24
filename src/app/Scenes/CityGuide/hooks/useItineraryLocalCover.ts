import { LocalImage, useLocalImageStorage } from "app/utils/LocalImageStore"

/**
 * Keyed by the itinerary rather than the image: while Gravity builds the new cover's versions
 * the server still returns the old image (or none), so no image id points at the new photo yet.
 */
export const itineraryCoverImageKey = (itineraryID: string) => `itinerary-cover-${itineraryID}`

export const isLocalImagePath = (url: string) => !/^https?:\/\//.test(url)

/**
 * The photo last saved as this itinerary's cover, for the 10 minutes LocalImageStore keeps it,
 * so a refetch that still returns the old cover doesn't replace it. Re-read whenever the
 * server's cover URL changes.
 */
export const useItineraryLocalCover = (
  itineraryID: string | null | undefined,
  serverCoverUrl: string | null | undefined
): LocalImage | null => {
  const localImage = useLocalImageStorage(
    itineraryID ? itineraryCoverImageKey(itineraryID) : null,
    undefined,
    undefined,
    serverCoverUrl
  )

  // `getLocalImage` doesn't check expiry; only `cleanLocalImages` drops stale entries.
  if (!localImage || Number(localImage.expires) <= Date.now()) {
    return null
  }

  return localImage
}
