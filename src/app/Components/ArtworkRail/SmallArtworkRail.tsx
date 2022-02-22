import { SmallArtworkRail_artworks$key } from "__generated__/SmallArtworkRail_artworks.graphql"
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
import {
  ARTWORK_RAIL_CARD_IMAGE_HEIGHT,
  ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT,
} from "./ArtworkRailCard"

type SmallArtworkRailProps = Omit<ArtworkRailProps, "artworks" | "size"> & {
  artworks: SmallArtworkRail_artworks$key
}

const IMAGE_WIDTH = 155

export const SmallArtworkRail: React.FC<SmallArtworkRailProps> = ({ artworks, ...restProps }) => {
  const artworksData = useFragment<SmallArtworkRail_artworks$key>(smallArtworksFragment, artworks)

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

export const SmallArtworkRailPlaceholder: React.FC = () => (
  <Join separator={<Spacer width={15} />}>
    {times(3 + useMemoizedRandom() * 10).map((index) => (
      <Flex key={index}>
        <PlaceholderBox height={ARTWORK_RAIL_CARD_IMAGE_HEIGHT.small} width={IMAGE_WIDTH} />
        <Spacer mb={2} />
        <Flex height={ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT}>
          <RandomWidthPlaceholderText minWidth={30} maxWidth={90} />
          <PlaceholderText width={IMAGE_WIDTH} />
          <RandomWidthPlaceholderText minWidth={30} maxWidth={90} />
        </Flex>
      </Flex>
    ))}
  </Join>
)
