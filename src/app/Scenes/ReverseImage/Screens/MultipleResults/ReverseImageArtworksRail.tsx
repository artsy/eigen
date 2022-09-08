import { ActionType, OwnerType, SelectedArtworkFromReverseImageSearch } from "@artsy/cohesion"
import { ReverseImageArtworksRail$key } from "__generated__/ReverseImageArtworksRail.graphql"
import { SmallArtworkRail } from "app/Components/ArtworkRail/SmallArtworkRail"
import { SearchImageHeaderButtonOwner } from "app/Components/SearchImageHeaderButton"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Flex, Text } from "palette"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface ReverseImageArtworksRailProps {
  artworks: ReverseImageArtworksRail$key
  owner: SearchImageHeaderButtonOwner
}

export const ReverseImageArtworksRail: React.FC<ReverseImageArtworksRailProps> = ({
  artworks,
  owner,
}) => {
  const tracking = useTracking()
  const data = useFragment(reverseImageArtworksRailFragment, artworks)
  const nodes = extractNodes(data)

  return (
    <Flex>
      <Text variant="sm" color="white100" mx={2}>
        Image Results
      </Text>

      <SmallArtworkRail
        artworks={nodes}
        onPress={(artwork, index) => {
          const event: SelectedArtworkFromReverseImageSearch = {
            action: ActionType.selectedArtworkFromReverseImageSearch,
            context_screen_owner_type: OwnerType.reverseImageSearch,
            destination_owner_type: OwnerType.artwork,
            destination_owner_id: artwork.internalID,
            destination_owner_slug: artwork.slug,
            owner_type: owner.type,
            owner_id: owner.id,
            owner_slug: owner.slug,
            total_matches_count: nodes.length,
            position: index,
          }

          tracking.trackEvent(event)
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
