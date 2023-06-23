import { ArtworkEntity, ArtworkListEntity } from "app/Components/ArtworkLists/types"
import { useToast } from "app/Components/Toast/toastHook"
import { ToastPlacement } from "app/Components/Toast/types"
import { navigate } from "app/system/navigation/navigate"

const DEFAULT_TOAST_PLACEMENT: ToastPlacement = "top"

interface Options {
  artwork: ArtworkEntity
}

type SavedToDefaultArtworkListOptions = Options & {
  onToastPress: () => void
}

type MultipleArtworkListsOptions = Options & {
  artworkLists: ArtworkListEntity[]
}

type SingleArtworkListOptions = Options & {
  artworkList: ArtworkListEntity
}

export const useArtworkListToast = () => {
  const toast = useToast()

  const savedToDefaultArtworkList = (options: SavedToDefaultArtworkListOptions) => {
    const { onToastPress } = options

    toast.show("Artwork saved", DEFAULT_TOAST_PLACEMENT, {
      cta: "Add to a List",
      onPress: onToastPress,
    })
  }

  const removedFromDefaultArtworkList = () => {
    toast.show("Removed from Saved Artworks", DEFAULT_TOAST_PLACEMENT)
  }

  const changesSaved = () => {
    toast.show("Changes saved", DEFAULT_TOAST_PLACEMENT)
  }

  const addedToSingleArtworkList = (options: SingleArtworkListOptions) => {
    const { artworkList } = options
    const message = `Added to ${artworkList.name} list`

    toast.show(message, DEFAULT_TOAST_PLACEMENT, {
      cta: "View List",
      onPress: () => {
        navigate(`/artwork-list/${artworkList.internalID}`)
      },
    })
  }

  const addedToMultipleArtworkLists = (options: MultipleArtworkListsOptions) => {
    const { artworkLists } = options
    const message = `Added to ${artworkLists.length} lists`

    toast.show(message, DEFAULT_TOAST_PLACEMENT, {
      cta: "View Saves",
      onPress: () => {
        navigate("/artwork-lists")
      },
    })
  }

  const removedFromSingleArtworkList = (options: SingleArtworkListOptions) => {
    const { artworkList } = options
    const message = `Removed from ${artworkList.name} list`

    toast.show(message, DEFAULT_TOAST_PLACEMENT)
  }

  const removedFromMultipleArtworkLists = (options: MultipleArtworkListsOptions) => {
    const { artworkLists } = options
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
