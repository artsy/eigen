import { ReverseImageArtworksRail$key } from "__generated__/ReverseImageArtworksRail.graphql"
import { SmallArtworkRail } from "app/Components/ArtworkRail/SmallArtworkRail"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Flex, Text } from "palette"
import { graphql, useFragment } from "react-relay"

interface ReverseImageArtworksRailProps {
  artworks: ReverseImageArtworksRail$key
}

export const ReverseImageArtworksRail: React.FC<ReverseImageArtworksRailProps> = (props) => {
  const data = useFragment(reverseImageArtworksRailFragment, props.artworks)
  const artworks = extractNodes(data)

  return (
    <Flex>
      <Text variant="sm" color="white100" mx={2}>
        Image Results
      </Text>

      <SmallArtworkRail
        artworks={artworks}
        onPress={(artwork) => {
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
