import { Flex, Join, Skeleton, SkeletonBox, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { times } from "lodash"

/** Mirrors `CityGuideEventGuides.tsx`'s hero image and guide-row image sizes. */
const HERO_HEIGHT = 198
const GUIDE_IMAGE_SIZE = 70
const GUIDE_ROWS = 2

/** Mirrors `CityFairRailCard.tsx`'s card size. */
const FAIR_CARD_WIDTH = 150
const FAIR_CARD_HEIGHT = 250

/** Mirrors `CityEventRailCard.tsx`'s card size. */
const SHOW_CARD_SIZE = 150

/** The 10pt gap `CityGuideEvents.tsx`'s rails put between cards. */
const RAIL_GAP = 10
const RAIL_CARDS = 3

const GuideRowPlaceholder = () => (
  <Flex flexDirection="row" gap={1}>
    <SkeletonBox width={GUIDE_IMAGE_SIZE} height={GUIDE_IMAGE_SIZE} />

    <Flex flex={1} justifyContent="center">
      <SkeletonText variant="md">Guide title</SkeletonText>
      <SkeletonText variant="xs">By author</SkeletonText>
    </Flex>
  </Flex>
)

/** Approximates `CityGuideEventGuides.tsx`'s dark curated-guides block. */
const GuidesBlockPlaceholder = () => (
  <Flex backgroundColor="mono100" py={2} px={2}>
    <SkeletonBox width="100%" height={HERO_HEIGHT} />

    <Spacer y={2} />

    <SkeletonText variant="lg-display">Curated City Guides</SkeletonText>
    <SkeletonText variant="xs">Date range</SkeletonText>

    <Spacer y={2} />

    <Join separator={<Spacer y={2} />}>
      {times(GUIDE_ROWS).map((index) => (
        <GuideRowPlaceholder key={index} />
      ))}
    </Join>
  </Flex>
)

/** A caption-less rail, approximating the Current Fairs rail's cards. */
const FairsRailPlaceholder = () => (
  <Flex>
    <Flex px={2}>
      <SkeletonText variant="lg">Current Fairs</SkeletonText>
    </Flex>

    <Spacer y={1} />

    <Flex flexDirection="row" px={2}>
      <Join separator={<Flex width={RAIL_GAP} />}>
        {times(RAIL_CARDS).map((index) => (
          <SkeletonBox key={index} width={FAIR_CARD_WIDTH} height={FAIR_CARD_HEIGHT} />
        ))}
      </Join>
    </Flex>
  </Flex>
)

/** A captioned rail, approximating the Current Shows / Opening Soon rails' cards. */
const ShowsRailPlaceholder = () => (
  <Flex>
    <Flex px={2}>
      <SkeletonText variant="lg">Current Shows</SkeletonText>
    </Flex>

    <Spacer y={1} />

    <Flex flexDirection="row" px={2}>
      <Join separator={<Flex width={RAIL_GAP} />}>
        {times(RAIL_CARDS).map((index) => (
          <Flex key={index} width={SHOW_CARD_SIZE} gap={0.5}>
            <SkeletonBox width={SHOW_CARD_SIZE} height={SHOW_CARD_SIZE} />
            <SkeletonText variant="xs">Show title</SkeletonText>
            <SkeletonText variant="xs">Exhibition period</SkeletonText>
          </Flex>
        ))}
      </Join>
    </Flex>
  </Flex>
)

/**
 * Reserves roughly the space `CityGuideNewSections` occupies once loaded, so the initial
 * load doesn't blank the screen the way `LoadingFallback: () => null` used to. Covers the
 * curated-guides block and the two card rails — the shapes that are effectively always
 * present — and skips the itineraries rail (too often absent, would over-reserve) and the
 * editorial sections (behind a feature flag, far below the fold).
 */
export const CityGuideNewPlaceholder: React.FC = () => {
  return (
    <Skeleton>
      <Flex testID="city-guide-new-placeholder">
        <Join separator={<Spacer y={4} />}>
          <GuidesBlockPlaceholder />
          <FairsRailPlaceholder />
          <ShowsRailPlaceholder />
        </Join>
      </Flex>
    </Skeleton>
  )
}
