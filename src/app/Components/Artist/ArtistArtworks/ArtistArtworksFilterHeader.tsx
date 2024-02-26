import { Box } from "@artsy/palette-mobile"
import { ArtistArtworksFilterHeader_artist$key } from "__generated__/ArtistArtworksFilterHeader_artist.graphql"
import { SavedSearchButtonV2 } from "app/Components/Artist/ArtistArtworks/SavedSearchButtonV2"
import { useShowArtworksFilterModal } from "app/Components/Artist/ArtistArtworks/hooks/useShowArtworksFilterModal"
import { useSelectedFiltersCount } from "app/Components/ArtworkFilter/useArtworkFilters"
import { ArtworksFilterHeader } from "app/Components/ArtworkGrids/ArtworksFilterHeader"
import { graphql, useFragment } from "react-relay"

interface ArtistArtworksFilterProps {
  artist: ArtistArtworksFilterHeader_artist$key
  showCreateAlertModal: () => void
}

export const ArtistArtworksFilterHeader: React.FC<ArtistArtworksFilterProps> = ({
  artist,
  showCreateAlertModal,
}) => {
  const data = useFragment(
    graphql`
      fragment ArtistArtworksFilterHeader_artist on Artist {
        internalID
        slug
      }
    `,
    artist
  )

  const appliedFiltersCount = useSelectedFiltersCount()
  const { openFilterArtworksModal } = useShowArtworksFilterModal({ artist: data })

  return (
    <Box backgroundColor="white">
      <ArtworksFilterHeader
        onFilterPress={() => {
          openFilterArtworksModal("sortAndFilter")
        }}
        selectedFiltersCount={appliedFiltersCount}
        childrenPosition="left"
      >
        <SavedSearchButtonV2
          artistId={data.internalID}
          artistSlug={data.slug}
          onPress={() => {
            showCreateAlertModal()
          }}
        />
      </ArtworksFilterHeader>
    </Box>
  )
}
