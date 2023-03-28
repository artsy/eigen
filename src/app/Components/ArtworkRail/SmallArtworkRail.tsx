import { SmallArtworkRail_artworks$key } from "__generated__/SmallArtworkRail_artworks.graphql"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { ArtworkRail, ArtworkRailProps } from "./ArtworkRail"

type SmallArtworkRailProps = Omit<ArtworkRailProps, "artworks" | "size"> & {
  artworks: SmallArtworkRail_artworks$key
}

export const SMALL_RAIL_IMAGE_WIDTH = 155

export const SmallArtworkRail: React.FC<SmallArtworkRailProps> = ({ artworks, ...restProps }) => {
  const artworksData = useFragment(smallArtworksFragment, artworks)

  return <ArtworkRail artworks={artworksData} {...restProps} size="small" />
}

const smallArtworksFragment = graphql`
  fragment SmallArtworkRail_artworks on Artwork @relay(plural: true) {
    ...ArtworkRailCard_artwork @arguments(width: 155)
    internalID
    href
    slug
  }
`
