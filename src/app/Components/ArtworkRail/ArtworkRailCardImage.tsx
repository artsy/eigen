import { Text } from "@artsy/palette-mobile"
import { ArtworkRailCardImage_artwork$key } from "__generated__/ArtworkRailCardImage_artwork.graphql"
import { graphql, useFragment } from "react-relay"

export interface ArtworkRailCardImageProps {
  artwork: ArtworkRailCardImage_artwork$key
}

export const ArtworkRailCardImage: React.FC<ArtworkRailCardImageProps> = ({ ...restProps }) => {
  const artwork = useFragment(artworkFragment, restProps.artwork)
  // TODO: Extract urgency tags (see LegacyArtworkRailCardImage)
  // TODO: Implement new image component

  return <Text>{artwork?.image?.url}</Text>
}

const artworkFragment = graphql`
  fragment ArtworkRailCardImage_artwork on Artwork {
    image(includeAll: false) {
      blurhash
      url(version: "large")
    }
  }
`
