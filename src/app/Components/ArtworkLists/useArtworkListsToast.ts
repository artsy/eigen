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
    const { artwork, onToastPress } = options

    toast.show("Artwork saved", DEFAULT_TOAST_PLACEMENT, {
      backgroundColor: "green100",
      cta: "Add to a List",
      imageURL: artwork.imageURL ?? undefined,
      onPress: onToastPress,
    })
  }

  const removedFromDefaultArtworkList = (options: Options) => {
    const { artwork } = options

    toast.show("Removed from Saved Artworks", DEFAULT_TOAST_PLACEMENT, {
      imageURL: artwork.imageURL ?? undefined,
    })
  }

  const changesSaved = (options?: Options) => {
    toast.show("Changes saved", DEFAULT_TOAST_PLACEMENT, {
      backgroundColor: "green100",
      imageURL: options?.artwork?.imageURL ?? undefined,
    })
  }

  const addedToSingleArtworkList = (options: SingleArtworkListOptions) => {
    const { artwork, artworkList } = options
    const message = `Added to ${artworkList.name} list`

    toast.show(message, DEFAULT_TOAST_PLACEMENT, {
      backgroundColor: "green100",
      cta: "View List",
      imageURL: artwork.imageURL ?? undefined,
      onPress: () => {
        navigate(`/artwork-list/${artworkList.internalID}`)
      },
    })
  }

  const addedToMultipleArtworkLists = (options: MultipleArtworkListsOptions) => {
    const { artwork, artworkLists } = options
    const message = `Added to ${artworkLists.length} lists`

    toast.show(message, DEFAULT_TOAST_PLACEMENT, {
      backgroundColor: "green100",
      cta: "View Saves",
      imageURL: artwork.imageURL ?? undefined,
      onPress: () => {
        navigate("/artwork-lists")
      },
    })
  }

  const removedFromSingleArtworkList = (options: SingleArtworkListOptions) => {
    const { artwork, artworkList } = options
    const message = `Removed from ${artworkList.name} list`

    toast.show(message, DEFAULT_TOAST_PLACEMENT, {
      imageURL: artwork.imageURL ?? undefined,
    })
  }

  const removedFromMultipleArtworkLists = (options: MultipleArtworkListsOptions) => {
    const { artwork, artworkLists } = options
    const message = `Removed from ${artworkLists.length} lists`

    toast.show(message, DEFAULT_TOAST_PLACEMENT, {
      imageURL: artwork.imageURL ?? undefined,
    })
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
