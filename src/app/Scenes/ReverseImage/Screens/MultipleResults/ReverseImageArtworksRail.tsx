import { ReverseImageArtworksRail$key } from "__generated__/ReverseImageArtworksRail.graphql"
import { SmallArtworkRail } from "app/Components/ArtworkRail/SmallArtworkRail"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Flex, Text } from "palette"
import { graphql, useFragment } from "react-relay"
import { RouteProp, useRoute } from "@react-navigation/native"
import { useTracking } from "react-tracking"
import { ActionType, OwnerType, SelectedArtworkFromReverseImageSearch } from "@artsy/cohesion"
import { ReverseImageNavigationStack } from "../../types"

interface ReverseImageArtworksRailProps {
  artworks: ReverseImageArtworksRail$key
}

export const ReverseImageArtworksRail: React.FC<ReverseImageArtworksRailProps> = (props) => {
  const route = useRoute<RouteProp<ReverseImageNavigationStack, "MultipleResults">>()
  const { owner } = route.params
  const tracking = useTracking()
  const data = useFragment(reverseImageArtworksRailFragment, props.artworks)
  const artworks = extractNodes(data)

  return (
    <Flex>
      <Text variant="sm" color="white100" mx={2}>
        Image Results
      </Text>

      <SmallArtworkRail
        artworks={artworks}
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
            total_matches_count: artworks.length,
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
