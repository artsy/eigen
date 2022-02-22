import { LargeArtworkRail_artworks$key } from "__generated__/LargeArtworkRail_artworks.graphql"
import {
  PlaceholderBox,
  PlaceholderText,
  RandomWidthPlaceholderText,
  useMemoizedRandom,
} from "app/utils/placeholders"
import { times } from "lodash"
import { Flex, Join, Spacer } from "palette"
import React from "react"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { ArtworkRail, ArtworkRailProps } from "./ArtworkRail"
import { ARTWORK_RAIL_CARD_IMAGE_HEIGHT } from "./ArtworkRailCard"

type LargeArtworkRailProps = Omit<ArtworkRailProps, "artworks" | "size"> & {
  artworks: LargeArtworkRail_artworks$key
}

const IMAGE_WIDTH = 295

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

export const LargeArtworkRailPlaceholder: React.FC = () => (
  <Join separator={<Spacer width={15} />}>
    {times(3 + useMemoizedRandom() * 10).map((index) => (
      <Flex key={index}>
        <PlaceholderBox height={ARTWORK_RAIL_CARD_IMAGE_HEIGHT.large} width={IMAGE_WIDTH} />
        <Spacer mb={2} />
        <PlaceholderText width={295} />
        <RandomWidthPlaceholderText minWidth={30} maxWidth={90} />
      </Flex>
    ))}
  </Join>
)
