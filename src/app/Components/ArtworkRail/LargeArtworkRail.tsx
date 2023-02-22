import { Spacer, Flex } from "@artsy/palette-mobile"
import { LargeArtworkRail_artworks$key } from "__generated__/LargeArtworkRail_artworks.graphql"
import {
  PlaceholderBox,
  PlaceholderText,
  RandomWidthPlaceholderText,
  useMemoizedRandom,
} from "app/utils/placeholders"
import { times } from "lodash"
import { Join } from "palette"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { ArtworkRail, ArtworkRailProps } from "./ArtworkRail"
import { ARTWORK_RAIL_CARD_IMAGE_HEIGHT } from "./ArtworkRailCard"

type LargeArtworkRailProps = Omit<ArtworkRailProps, "artworks" | "size"> & {
  artworks: LargeArtworkRail_artworks$key
}

export const LARGE_RAIL_IMAGE_WIDTH = 295

export const LargeArtworkRail: React.FC<LargeArtworkRailProps> = ({
  artworks,
  showSaveIcon = true,
  ...restProps
}) => {
  const artworksData = useFragment(largeArtworksFragment, artworks)

  return (
    <ArtworkRail artworks={artworksData} showSaveIcon={showSaveIcon} {...restProps} size="large" />
  )
}

const largeArtworksFragment = graphql`
  fragment LargeArtworkRail_artworks on Artwork @relay(plural: true) {
    ...ArtworkRailCard_artwork @arguments(width: 590)
    internalID
    href
    slug
  }
`

export const LargeArtworkRailPlaceholder: React.FC = () => (
  <Join separator={<Spacer x="15px" />}>
    {times(3 + useMemoizedRandom() * 10).map((index) => (
      <Flex key={index}>
        <PlaceholderBox
          height={ARTWORK_RAIL_CARD_IMAGE_HEIGHT.large}
          width={LARGE_RAIL_IMAGE_WIDTH}
        />
        <Spacer y={2} />
        <PlaceholderText width={295} />
        <RandomWidthPlaceholderText minWidth={30} maxWidth={90} />
      </Flex>
    ))}
  </Join>
)
