import { ActionType, OwnerType, SelectedArtworkFromReverseImageSearch } from "@artsy/cohesion"
import { ReverseImageArtworksRail$key } from "__generated__/ReverseImageArtworksRail.graphql"
import { SmallArtworkRail } from "app/Components/ArtworkRail/SmallArtworkRail"
import { useReverseImageContext } from "app/Scenes/ReverseImage/ReverseImageContext"
import { ReverseImageOwner } from "app/Scenes/ReverseImage/types"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Flex, Text } from "palette"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface ReverseImageArtworksRailProps {
  artworks: ReverseImageArtworksRail$key
}

export const ReverseImageArtworksRail: React.FC<ReverseImageArtworksRailProps> = ({ artworks }) => {
  const tracking = useTracking()
  const data = useFragment(reverseImageArtworksRailFragment, artworks)
  const nodes = extractNodes(data)
  const { analytics } = useReverseImageContext()
  const { owner } = analytics

  return (
    <Flex>
      <Text variant="sm" color="white100" mx={2}>
        Image Results
      </Text>

      <SmallArtworkRail
        artworks={nodes}
        onPress={(artwork, index) => {
          tracking.trackEvent(
            tracks.selectedArtworkFromReverseImageSearch({
              owner,
              position: index,
              artworkId: artwork.internalID,
              artworkSlug: artwork.slug,
              totalMatchesCount: nodes.length,
            })
          )
          navigate(`/artwork/${artwork.internalID}`)
        }}
      />
    </Flex>
  )
}

const reverseImageArtworksRailFragment = graphql`
  fragment ReverseImageArtworksRail on ArtworkConnection {
    edges {
      node {
        ...SmallArtworkRail_artworks
      }
    }
  }
`

interface SelectedArtworkEventData {
  owner: ReverseImageOwner
  artworkId: string
  artworkSlug: string
  position: number
  totalMatchesCount: number
}

const tracks = {
  selectedArtworkFromReverseImageSearch: ({
    owner,
    artworkId,
    artworkSlug,
    position,
    totalMatchesCount,
  }: SelectedArtworkEventData): SelectedArtworkFromReverseImageSearch => ({
    action: ActionType.selectedArtworkFromReverseImageSearch,
    context_screen_owner_type: OwnerType.reverseImageSearch,
    destination_owner_type: OwnerType.artwork,
    destination_owner_id: artworkId,
    destination_owner_slug: artworkSlug,
    owner_type: owner.type,
    owner_id: owner.id,
    owner_slug: owner.slug,
    total_matches_count: totalMatchesCount,
    position,
  }),
}
