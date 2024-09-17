import { Spacer, Flex, Join } from "@artsy/palette-mobile"
import { LargeArtworkRail_artworks$key } from "__generated__/LargeArtworkRail_artworks.graphql"
import {
  PlaceholderBox,
  PlaceholderText,
  RandomWidthPlaceholderText,
  useMemoizedRandom,
} from "app/utils/placeholders"
import { ArtworkActionTrackingProps } from "app/utils/track/ArtworkActions"
import { times } from "lodash"
import { useFragment, graphql } from "react-relay"
import { ArtworkRail, ArtworkRailProps } from "./ArtworkRail"
import { ARTWORK_RAIL_CARD_IMAGE_HEIGHT } from "./ArtworkRailCard"

type LargeArtworkRailProps = Omit<ArtworkRailProps, "artworks" | "size"> & {
  artworks: LargeArtworkRail_artworks$key
} & ArtworkActionTrackingProps

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
    collectorSignals {
      primaryLabel
      auction {
        bidCount
        lotWatcherCount
      }
    }
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
