import { SmallArtworkRail_artworks$key } from "__generated__/SmallArtworkRail_artworks.graphql"
import React from "react"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { ArtworkRail, ArtworkRailProps } from "./ArtworkRail"

type SmallArtworkRailProps = Omit<ArtworkRailProps, "artworks" | "size"> & { artworks: SmallArtworkRail_artworks$key }

export const SmallArtworkRail: React.FC<SmallArtworkRailProps> = ({ artworks, ...restProps }) => {
  const artworksData = useFragment<SmallArtworkRail_artworks$key>(smallArtworksFragment, artworks)

  return <ArtworkRail artworks={artworksData as any} {...restProps} size="small" />
}

const smallArtworksFragment = graphql`
  fragment SmallArtworkRail_artworks on Artwork @relay(plural: true) {
    ...ArtworkRailCard_artwork @arguments(width: 155)
    id
    href
    slug
  }
`
