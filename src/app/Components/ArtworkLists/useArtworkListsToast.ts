import { useToast } from "app/Components/Toast/toastHook"
import { ToastPlacement } from "app/Components/Toast/types"

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

  return {
    savedToDefaultArtworkList,
    removedFromDefaultArtworkList,
    changesSaved,
  }
}
