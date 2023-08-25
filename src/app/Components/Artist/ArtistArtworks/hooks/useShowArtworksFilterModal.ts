import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { Schema } from "app/utils/track"
import { useTracking } from "react-tracking"

type FilterModalOpenedFrom = "sortAndFilter" | "createAlert"

interface UseShowArtworksFilterModalProps {
  artist: {
    internalID: string
    slug: string
  }
}

export const useShowArtworksFilterModal = (props: UseShowArtworksFilterModalProps) => {
  const tracking = useTracking()
  const showFilterArtworksModal = ArtworksFiltersStore.useStoreState(
    (state) => state.showFilterArtworksModal
  )
  const setShowFilterArtworksModal = ArtworksFiltersStore.useStoreActions(
    (state) => state.setShowFilterArtworksModal
  )

  const openFilterArtworksModal = (openedFrom: FilterModalOpenedFrom) => {
    if (openedFrom === "sortAndFilter") {
      tracking.trackEvent({
        action_name: "filter",
        context_screen_owner_type: Schema.OwnerEntityTypes.Artist,
        context_screen: Schema.PageNames.ArtistPage,
        context_screen_owner_id: props.artist.internalID,
        context_screen_owner_slug: props.artist.slug,
        action_type: Schema.ActionTypes.Tap,
      })
    }

    setShowFilterArtworksModal(true)
  }

  const closeFilterArtworksModal = () => {
    tracking.trackEvent({
      action_name: "closeFilterWindow",
      context_screen_owner_type: Schema.OwnerEntityTypes.Artist,
      context_screen: Schema.PageNames.ArtistPage,
      context_screen_owner_id: props.artist.internalID,
      context_screen_owner_slug: props.artist.slug,
      action_type: Schema.ActionTypes.Tap,
    })

    setShowFilterArtworksModal(false)
  }

  return {
    showFilterArtworksModal,
    openFilterArtworksModal,
    closeFilterArtworksModal,
  }
}
