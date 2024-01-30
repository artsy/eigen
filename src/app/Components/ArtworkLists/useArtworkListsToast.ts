import { ArtworkEntity, ArtworkListEntity } from "app/Components/ArtworkLists/types"
import { useToast } from "app/Components/Toast/toastHook"
import { ToastOptions, ToastPlacement } from "app/Components/Toast/types"
import { navigate } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

const DEFAULT_TOAST_PLACEMENT: ToastPlacement = "bottom"

interface Options {
  artwork: ArtworkEntity
}

type SavedToDefaultArtworkListOptions = {
  onToastPress: () => void
}

type MultipleArtworkListsOptions = Options & {
  artworkLists: ArtworkListEntity[]
}

type SingleArtworkListOptions = Options & {
  artworkList: ArtworkListEntity
}

export const useArtworkListToast = (bottomPadding?: number | null) => {
  const toast = useToast()
  const isPartnerOfferEnabled = useFeatureFlag("AREnablePartnerOffer")

  const showToast = (message: string, options?: Omit<ToastOptions, "bottomPadding">) => {
    toast.show(message, DEFAULT_TOAST_PLACEMENT, {
      ...options,
      bottomPadding: bottomPadding ?? null,
    })
  }
  const savedToDefaultArtworkList = (options: SavedToDefaultArtworkListOptions) => {
    const { onToastPress } = options

    showToast("Artwork saved", {
      cta: "Add to a List",
      onPress: onToastPress,
      backgroundColor: "green100",
      description: isPartnerOfferEnabled
        ? "Saving an artwork signals interest to galleries."
        : null,
    })
  }

  const removedFromDefaultArtworkList = () => {
    showToast("Removed from Saved Artworks")
  }

  const changesSaved = () => {
    showToast("Changes saved", {
      backgroundColor: "green100",
    })
  }

  const addedToSingleArtworkList = (options: SingleArtworkListOptions) => {
    const { artworkList } = options
    const message = `Added to ${artworkList.name} list`

    showToast(message, {
      cta: "View List",
      onPress: () => {
        navigate(`/artwork-list/${artworkList.internalID}`)
      },
      backgroundColor: "green100",
    })
  }

  const addedToMultipleArtworkLists = (options: MultipleArtworkListsOptions) => {
    const { artworkLists } = options
    const message = `Added to ${artworkLists.length} lists`

    showToast(message, {
      cta: "View Saves",
      onPress: () => {
        navigate("/artwork-lists")
      },
      backgroundColor: "green100",
    })
  }

  const removedFromSingleArtworkList = (options: SingleArtworkListOptions) => {
    const { artworkList } = options
    const message = `Removed from ${artworkList.name} list`

    showToast(message)
  }

  const removedFromMultipleArtworkLists = (options: MultipleArtworkListsOptions) => {
    const { artworkLists } = options
    const message = `Removed from ${artworkLists.length} lists`

    showToast(message)
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
