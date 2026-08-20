import { ActionType, ContextModule, OwnerType, type RailViewed } from "@artsy/cohesion"
import { Flex, Join, Skeleton, SkeletonBox, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { ARTWORK_RAIL_CARD_IMAGE_HEIGHT } from "app/Components/ArtworkRail/ArtworkRailCardImage"
import { RecentSearchesPillsRail } from "app/Scenes/Search/TrendingSearches/components/RecentSearchesPillsRail"
import { TrendingArtistsAvatarsRail } from "app/Scenes/Search/TrendingSearches/components/TrendingArtistsAvatarsRail"
import { TrendingArtworksRail } from "app/Scenes/Search/TrendingSearches/components/TrendingArtworksRail"
import { TrendingPeriodToggle } from "app/Scenes/Search/TrendingSearches/components/TrendingPeriodToggle"
import { AVATAR_ITEM_WIDTH, AVATAR_SIZE } from "app/Scenes/Search/TrendingSearches/constants"
import {
  TrendingPeriod,
  useTrendingSearches,
} from "app/Scenes/Search/TrendingSearches/useTrendingSearches"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { times } from "lodash"
import { startTransition, useEffect, useState } from "react"
import { ScrollView } from "react-native"
import { useTracking } from "react-tracking"

export const TrendingSearches: React.FC = () => {
  const tabBarHeight = useBottomTabBarHeight()
  const [period, setPeriod] = useState<TrendingPeriod>("ONE_DAY")

  const handlePeriodChange = (next: TrendingPeriod) => {
    startTransition(() => setPeriod(next))
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: tabBarHeight + 24 }}
    >
      <Join separator={<Spacer y={2} />}>
        <RecentSearchesPillsRail />
        <TrendingSection period={period} />
        <TrendingPeriodToggle value={period} onChange={handlePeriodChange} />
      </Join>
    </ScrollView>
  )
}

const TrendingContent: React.FC<{ period: TrendingPeriod }> = ({ period }) => {
  const { artists, artworks } = useTrendingSearches(period)
  const { trackEvent } = useTracking()

  useEffect(() => {
    const trackRailViewed = (contextModule: ContextModule) => {
      const event: RailViewed = {
        action: ActionType.railViewed,
        context_module: contextModule,
        context_screen: OwnerType.search,
      }
      trackEvent(event)
    }

    if (artists.length > 0) {
      trackRailViewed(ContextModule.trendingArtistsRail)
    }
    if (artworks.length > 0) {
      trackRailViewed(ContextModule.trendingArtworksRail)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Flex>
      <Join separator={<Spacer y={2} />}>
        <TrendingArtistsAvatarsRail artists={artists} />
        <TrendingArtworksRail artworks={artworks} />
      </Join>
    </Flex>
  )
}

const TrendingSection = withSuspense({
  Component: TrendingContent,
  LoadingFallback: () => <TrendingPlaceholder />,
  ErrorFallback: NoFallback,
})

const AVATAR_ITEM_COUNT = 4
const RAIL_CARD_WIDTH = 240
const RAIL_CARD_COUNT = 3

const TrendingPlaceholder: React.FC = () => (
  <Skeleton>
    <Flex>
      <SkeletonText variant="sm-display" mx={2} mb={2}>
        Trending Artists
      </SkeletonText>

      <Flex flexDirection="row" px={2} gap={1}>
        {times(AVATAR_ITEM_COUNT).map((index) => (
          <Flex key={index} alignItems="center" width={AVATAR_ITEM_WIDTH}>
            <SkeletonBox width={AVATAR_SIZE} height={AVATAR_SIZE} borderRadius={AVATAR_SIZE / 2} />
            <Spacer y={0.5} />
            <SkeletonText variant="xs">Artist Name</SkeletonText>
          </Flex>
        ))}
      </Flex>

      <Spacer y={2} />

      <SkeletonText variant="sm-display" mx={2} mb={2}>
        Trending Artworks
      </SkeletonText>

      <Flex flexDirection="row" px={2} gap={2}>
        {times(RAIL_CARD_COUNT).map((index) => (
          <Flex key={index} width={RAIL_CARD_WIDTH}>
            <SkeletonBox width={RAIL_CARD_WIDTH} height={ARTWORK_RAIL_CARD_IMAGE_HEIGHT} />
            <Spacer y={1} />
            <SkeletonText variant="sm-display">Artist Name</SkeletonText>
            <SkeletonText variant="xs">Title, Year</SkeletonText>
            <SkeletonText variant="xs">Price</SkeletonText>
          </Flex>
        ))}
      </Flex>
    </Flex>
  </Skeleton>
)
