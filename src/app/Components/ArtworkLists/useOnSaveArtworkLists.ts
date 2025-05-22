import { dispatchArtworkSavedStateChanged } from "app/Components/ArtworkLists/ArtworkListEvents"
import { ArtworkListsStore } from "app/Components/ArtworkLists/ArtworkListsStore"
import { useArtworkListToast } from "app/Components/ArtworkLists/useArtworkListsToast"
import { useCallback } from "react"

export const useOnSaveArtworkLists = () => {
  const { artwork, bottomPadding, addingArtworkLists, removingArtworkLists, modifiedActionType } =
    ArtworkListsStore.useStoreState((state) => ({
      artwork: state.state.artwork,
      bottomPadding: state.state.toastBottomPadding,
      addingArtworkLists: state.state.addingArtworkLists,
      removingArtworkLists: state.state.removingArtworkLists,
      modifiedActionType: state.modifiedActionType,
    }))
  const toast = useArtworkListToast(bottomPadding)

  const onSaveArtworkLists = useCallback(() => {
    if (!artwork) {
      return
    }

    switch (modifiedActionType()) {
      case "ADDED_MULTIPLE_LIST":
        toast.addedToMultipleArtworkLists({
          artwork,
          artworkLists: addingArtworkLists,
        })
        break
      case "ADDED_SINGLE_LIST":
        toast.addedToSingleArtworkList({
          artwork,
          artworkList: addingArtworkLists[0],
        })
        break
      case "REMOVED_SINGLE_LIST":
        toast.removedFromSingleArtworkList({
          artwork,
          artworkList: removingArtworkLists[0],
        })
        break
      case "REMOVED_MULTIPLE_LIST":
        toast.removedFromMultipleArtworkLists({
          artwork,
          artworkLists: removingArtworkLists,
        })
        break
      case "ADDED_AND_REMOVED_LIST":
        dispatchArtworkSavedStateChanged(artwork.internalID)
        toast.changesSaved()
        break
      case "GENERIC_CHANGES":
        toast.changesSaved()
        break
    }
  }, [artwork, addingArtworkLists, removingArtworkLists, modifiedActionType, toast])

  return { onSaveArtworkLists }
}
