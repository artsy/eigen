import { useScreenDimensions } from "@artsy/palette-mobile"
import { createGeminiUrl } from "@artsy/palette-mobile/dist/utils/createGeminiUrl"
import { InfiniteDiscoveryArtworkCard_artwork$data } from "__generated__/InfiniteDiscoveryArtworkCard_artwork.graphql"
import { useSaveArtworkToArtworkLists } from "app/Components/ArtworkLists/useSaveArtworkToArtworkLists"
import { useInfiniteDiscoveryTracking } from "app/Scenes/InfiniteDiscovery/hooks/useInfiniteDiscoveryTracking"
import { GlobalStore } from "app/store/GlobalStore"
import { PixelRatio } from "react-native"

const getThumbnailUrl = (url: string, screenWidth: number) => {
  const referenceWidth = 85
  const referenceHeight = 106
  const scaleReference = 350
  const scale = (screenWidth - 40) / scaleReference
  return createGeminiUrl({
    imageURL: url,
    width: Math.round(referenceWidth * scale * PixelRatio.get()),
    height: Math.round(referenceHeight * scale * PixelRatio.get()),
  })
}

export const useInfiniteDiscoveryCardSave = (
  artwork: InfiniteDiscoveryArtworkCard_artwork$data | null
) => {
  const { width: screenWidth } = useScreenDimensions()
  const track = useInfiniteDiscoveryTracking()

  const { hasSavedArtworks } = GlobalStore.useAppState((state) => state.infiniteDiscovery)
  const setHasSavedArtworks = GlobalStore.actions.infiniteDiscovery.setHasSavedArtworks
  const isNewUserOnboardingSession =
    GlobalStore.useAppState((state) => state.onboarding.onboardingState) === "incomplete"
  const {
    incrementSavedArtworksCount,
    decrementSavedArtworksCount,
    addNewUserOnboardingSavedArtwork,
    removeNewUserOnboardingSavedArtwork,
  } = GlobalStore.actions.infiniteDiscovery

  const addOnboardingArtwork = () => {
    if (isNewUserOnboardingSession && artwork) {
      addNewUserOnboardingSavedArtwork({
        internalID: artwork.internalID,
        url: getThumbnailUrl(artwork.images[0]?.url ?? "", screenWidth),
        blurhash: artwork.images[0]?.blurhash,
      })
    }
  }

  const removeOnboardingArtwork = () => {
    if (isNewUserOnboardingSession && artwork) {
      removeNewUserOnboardingSavedArtwork(artwork.internalID)
    }
  }

  const { isSaved, saveArtworkToLists } = useSaveArtworkToArtworkLists({
    artworkFragmentRef: artwork as NonNullable<InfiniteDiscoveryArtworkCard_artwork$data>,
    suppressToasts: isNewUserOnboardingSession,
    onCompleted: (isArtworkSaved) => {
      if (!!artwork) {
        track.savedArtwork(isArtworkSaved, artwork.internalID, artwork.slug)
      }
    },
    onError: () => {
      /**
       * This logic assumes that the saved artworks count was optimistically incremented or decremented when the save button was pressed.
       * If the save operation fails, we need to revert the saved artworks count to its previous state.
       * This is needed because the optimisticUpdater callback in useSaveArtworkToArtworkLists performs some actions that can take severel seconds to complete,
       * and as a result the saved artworks count can be out of sync with the actual state of the artwork.
       */
      if (isSaved) {
        // if the artwork is currently saved, we optimistically decremented the count, so increment it back
        incrementSavedArtworksCount()
        addOnboardingArtwork()
      } else {
        // if the artwork is currently unsaved, we optimistically incremented the count, so decrement it back
        decrementSavedArtworksCount()
        removeOnboardingArtwork()
      }
    },
  })

  const handleSaveButtonPress = () => {
    if (!hasSavedArtworks) setHasSavedArtworks(true)

    if (isSaved) {
      // if the artwork is currently saved, it will become unsaved, so optimistically decrement the count
      decrementSavedArtworksCount()
      removeOnboardingArtwork()
    } else {
      // if the artwork is currently unsaved, it will become saved, so optimistically increment the count
      incrementSavedArtworksCount()
      addOnboardingArtwork()
    }

    saveArtworkToLists()
  }

  const handleDoubleTapSave = () => {
    if (isSaved) return

    if (!hasSavedArtworks) setHasSavedArtworks(true)
    incrementSavedArtworksCount()
    addOnboardingArtwork()
    saveArtworkToLists()
  }

  return { isSaved, handleSaveButtonPress, handleDoubleTapSave }
}
