import { ArtworkListEntity } from "app/Components/ArtworkLists/types"
import { useToast } from "app/Components/Toast/toastHook"
import { ToastPlacement } from "app/Components/Toast/types"
import { navigate } from "app/system/navigation/navigate"

const DEFAULT_TOAST_PLACEMENT: ToastPlacement = "top"

export const useArtworkListToast = () => {
  const toast = useToast()

  const savedToDefaultArtworkList = (onToastPress: () => void) => {
    toast.show("Artwork saved", DEFAULT_TOAST_PLACEMENT, {
      backgroundColor: "green100",
      onPress: onToastPress,
    })
  }

  const removedFromDefaultArtworkList = () => {
    toast.show("Removed from Saved Artworks", DEFAULT_TOAST_PLACEMENT)
  }

  const changesSaved = () => {
    toast.show("Changes saved", DEFAULT_TOAST_PLACEMENT, {
      backgroundColor: "green100",
    })
  }

  const addedToSingleArtworkList = (artworkList: ArtworkListEntity) => {
    const message = `Added to ${artworkList.name} list`

    toast.show(message, DEFAULT_TOAST_PLACEMENT, {
      backgroundColor: "green100",
      cta: "View List",
      onPress: () => {
        navigate(`/artwork-list/${artworkList.internalID}`)
      },
    })
  }

  const addedToMultipleArtworkLists = (artworkLists: ArtworkListEntity[]) => {
    const message = `Added to ${artworkLists.length} lists`

    toast.show(message, DEFAULT_TOAST_PLACEMENT, {
      backgroundColor: "green100",
      cta: "View Saves",
      onPress: () => {
        navigate(`/artwork-lists`)
      },
    })
  }

  const removedFromSingleArtworkList = (artworkList: ArtworkListEntity) => {
    const message = `Removed from ${artworkList.name} list`

    toast.show(message, DEFAULT_TOAST_PLACEMENT)
  }

  const removedFromMultipleArtworkLists = (artworkLists: ArtworkListEntity[]) => {
    const message = `Removed from ${artworkLists.length} lists`

    toast.show(message, DEFAULT_TOAST_PLACEMENT)
  }

  return {
    savedToDefaultArtworkList,
    removedFromDefaultArtworkList,
    addedToSingleArtworkList,
    addedToMultipleArtworkLists,
    removedFromSingleArtworkList,
    removedFromMultipleArtworkLists,
    changesSaved,
  }
}
