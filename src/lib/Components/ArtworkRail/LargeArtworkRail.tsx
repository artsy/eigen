import { LargeArtworkRail_artworks$key } from "__generated__/LargeArtworkRail_artworks.graphql"
import React from "react"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { ArtworkRail, ArtworkRailProps } from "./ArtworkRail"

type LargeArtworkRailProps = Omit<ArtworkRailProps, "artworks" | "size"> & { artworks: LargeArtworkRail_artworks$key }

export const LargeArtworkRail: React.FC<LargeArtworkRailProps> = ({ artworks, ...restProps }) => {
  const artworksData = useFragment<LargeArtworkRail_artworks$key>(largeArtworksFragment, artworks)

  return <ArtworkRail artworks={artworksData} {...restProps} size="large" />
}

const largeArtworksFragment = graphql`
  fragment LargeArtworkRail_artworks on Artwork @relay(plural: true) {
    ...ArtworkRailCard_artwork @arguments(width: 295)
    internalID
    href
    slug
  }
`
