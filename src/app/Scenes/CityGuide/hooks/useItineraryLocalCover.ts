import { LocalImage, useLocalImageStorage } from "app/utils/LocalImageStore"

export const itineraryCoverKey = (itineraryID: string) => `itinerary-cover-${itineraryID}`

/**
 * A cover saved from this device in the last 10 minutes. Gravity swaps the image in a background
 * job, so for a while after a save the server still returns the old cover, or none.
 */
export const useItineraryLocalCover = (
  itineraryID: string | null | undefined,
  refreshKey?: unknown
): LocalImage | null => {
  const localImage = useLocalImageStorage(
    itineraryID ? itineraryCoverKey(itineraryID) : null,
    undefined,
    undefined,
    refreshKey
  )

  // `getLocalImage` doesn't check expiry; only `cleanLocalImages` drops stale entries.
  if (!localImage || Number(localImage.expires) <= Date.now()) {
    return null
  }

  return localImage
}
