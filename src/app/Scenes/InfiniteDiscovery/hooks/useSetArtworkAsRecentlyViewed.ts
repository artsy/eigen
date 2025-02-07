import { useRecordViewArtwork } from "app/utils/mutations/useRecordArtworkView"
import { useState } from "react"

export const useSetArtworkAsRecentlyViewed = (artworkId?: string) => {
  const [isViewed, setIsViewed] = useState(false)
  const [commitMutation, isInFlight] = useRecordViewArtwork()

  const setArtworkAsRecentlyViewed = () => {
    if (!isViewed && !isInFlight) {
      commitMutation({
        variables: { input: { artwork_id: artworkId } },
        onError: (error) => console.error("[setArtworkAsRecentlyViewed error]:", error),
        onCompleted: () => {
          setIsViewed(true)
        },
      })
    }
  }

  return { setArtworkAsRecentlyViewed }
}
