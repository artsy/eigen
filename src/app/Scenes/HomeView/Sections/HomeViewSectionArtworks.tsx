import { ContextModule, OwnerType, ScreenOwnerType } from "@artsy/cohesion"
import {
  Flex,
  FlexProps,
  Join,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
} from "@artsy/palette-mobile"
import { ArtworkGridItem_artwork$data } from "__generated__/ArtworkGridItem_artwork.graphql"
import { ArtworkRail_artworks$data } from "__generated__/ArtworkRail_artworks.graphql"
import { HomeViewSectionArtworksQuery } from "__generated__/HomeViewSectionArtworksQuery.graphql"
import { HomeViewSectionArtworks_section$key } from "__generated__/HomeViewSectionArtworks_section.graphql"
import { ArtworkRail } from "app/Components/ArtworkRail/ArtworkRail"
import {
  ARTWORK_RAIL_CARD_IMAGE_HEIGHT,
  ARTWORK_RAIL_CARD_MIN_WIDTH,
} from "app/Components/ArtworkRail/ArtworkRailCardImage"
import { ProgressiveOnboardingLongPressContextMenu } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingLongPressContextMenu"
import { SectionTitle } from "app/Components/SectionTitle"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { HomeViewStore } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionArtworksGrid } from "app/Scenes/HomeView/Sections/HomeViewSectionArtworksGrid"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { getHomeViewSectionHref } from "app/Scenes/HomeView/helpers/getHomeViewSectionHref"
import { useEnableLiveHomeRecommendations } from "app/Scenes/HomeView/hooks/useEnableLiveHomeRecommendations"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { useItemsImpressionsTracking } from "app/Scenes/HomeView/hooks/useImpressionsTracking"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { isDislikeArtworksEnabledFor } from "app/utils/isDislikeArtworksEnabledFor"
import { useMemoizedRandom } from "app/utils/placeholders"
import { times } from "lodash"
import { memo, useEffect } from "react"
import { fetchQuery, graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionArtworksProps extends FlexProps {
  section: HomeViewSectionArtworks_section$key
  index: number
}

const GRID_MAX_ARTWORKS_COUNT = 4

// Section id for the recommended artworks rail (the rail with live-refresh behavior).
const RECOMMENDED_ARTWORKS_SECTION_ID = "home-view-section-recommended-artworks"

export const HomeViewSectionArtworks: React.FC<HomeViewSectionArtworksProps> = ({
  section: sectionProp,
  index,
  ...flexProps
}) => {
  const tracking = useHomeViewTracking()

  const section = useFragment(fragment, sectionProp)
  const viewableSections = HomeViewStore.useStoreState((state) => state.viewableSections)

  const { enabled: enableLiveRecommendations } = useEnableLiveHomeRecommendations()
  const enableHidingDislikedArtworks = useFeatureFlag("AREnableHidingDislikedArtworks")
  const liveRefetchKey = HomeViewStore.useStoreState((state) => state.liveRefetchKey)

  const isLiveRecommendationsRail =
    enableLiveRecommendations && section.internalID === RECOMMENDED_ARTWORKS_SECTION_ID

  const shouldShowInGrid = section.component?.type === "ArtworksGrid"
  const contextModule = section.contextModule as ContextModule

  const { onViewableItemsChanged, viewabilityConfig, resetTracking } = useItemsImpressionsTracking({
    // It is important here to tell if the rail is visible or not, because the viewability config
    // default behavior, doesn't take into account the fact that the rail could be not visible
    // on the screen because it's within a scrollable container.
    isInViewport: viewableSections.includes(section.internalID) && section.trackItemImpressions,
    contextModule,
  })

  // When the live refetch key is bumped (returning to home or pull to refresh), force a fresh
  // fetch of the rail's artworks. Impression tracking is re-fired in `complete` — once the new
  // data is in the store — so railViewed/itemViewed reflect the new content, not the stale rail.
  useEffect(() => {
    if (!isLiveRecommendationsRail || liveRefetchKey === 0) {
      return
    }

    const subscription = fetchQuery<HomeViewSectionArtworksQuery>(
      getRelayEnvironment(),
      homeViewSectionArtworksQuery,
      { id: section.internalID, enableHidingDislikedArtworks },
      { networkCacheConfig: { force: true } }
    ).subscribe({
      complete: () => {
        resetTracking()
        tracking.viewedSection(contextModule, index)
      },
      error: (error: Error) => {
        console.error("Failed to refresh live artworks rail", error)
      },
    })

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveRefetchKey])

  let artworks = extractNodes(section.artworksConnection)

  if (isDislikeArtworksEnabledFor(contextModule)) {
    artworks = artworks.filter((artwork) => !artwork.isDisliked)
  }

  const viewAll = section.component?.behaviors?.viewAll

  if (!artworks.length) {
    return null
  }

  const artworksForGrid = shouldShowInGrid ? artworks.slice(0, GRID_MAX_ARTWORKS_COUNT) : artworks

  const handleOnArtworkPress = (artwork: ArtworkRail_artworks$data[number], position: number) => {
    tracking.tappedArtworkGroup(
      artwork.internalID,
      artwork.slug,
      artwork?.collectorSignals,
      contextModule,
      position
    )
  }

  const handleOnGridArtworkPress = (
    _artworkSlug: string,
    artwork?: ArtworkGridItem_artwork$data,
    itemIndex?: number
  ) => {
    if (!artwork) {
      return
    }

    tracking.tappedArtworkGroup(
      artwork.internalID,
      artwork.slug,
      artwork.collectorSignals,
      contextModule,
      itemIndex ?? 0
    )
  }

  const moreHref = getHomeViewSectionHref(viewAll?.href, section)

  const onSectionViewAll = () => {
    tracking.tappedArtworkGroupViewAll(
      contextModule,
      (viewAll?.ownerType || section.ownerType) as ScreenOwnerType
    )
  }

  const onMorePress = () => {
    tracking.tappedArtworkGroupViewAll(
      contextModule,
      (viewAll?.ownerType || section.ownerType) as ScreenOwnerType
    )
  }

  // This is a temporary solution to show the long press context menu only on the first artwork section
  const isFirstArtworkSection = contextModule === ContextModule.newWorksForYouRail

  return (
    <Flex {...flexProps}>
      <SectionTitle
        href={moreHref}
        mx={2}
        title={section.component?.title}
        onPress={moreHref ? onSectionViewAll : undefined}
      />
      {!!isFirstArtworkSection && <ProgressiveOnboardingLongPressContextMenu />}

      {shouldShowInGrid ? (
        <HomeViewSectionArtworksGrid
          artworks={artworksForGrid}
          moreHref={moreHref}
          onMorePress={onMorePress}
          onArtworkPress={handleOnGridArtworkPress}
          trackItemImpressions={section.trackItemImpressions}
          contextModule={contextModule}
        />
      ) : (
        <ArtworkRail
          contextModule={contextModule}
          contextScreenOwnerType={OwnerType.home}
          artworks={artworks}
          onPress={handleOnArtworkPress}
          showSaveIcon
          moreHref={moreHref}
          onMorePress={onMorePress}
          {...(section.trackItemImpressions
            ? {
                onViewableItemsChanged: onViewableItemsChanged,
                viewabilityConfig: viewabilityConfig,
              }
            : {})}
        />
      )}

      <HomeViewSectionSentinel
        contextModule={contextModule}
        sectionType={section.__typename}
        index={index}
      />
    </Flex>
  )
}

const fragment = graphql`
  fragment HomeViewSectionArtworks_section on HomeViewSectionArtworks
  @argumentDefinitions(
    enableHidingDislikedArtworks: { type: "Boolean", defaultValue: false }
    first: { type: "Int", defaultValue: 10 }
  ) {
    __typename
    internalID
    contextModule
    component {
      title
      type
      behaviors {
        viewAll {
          href
          ownerType
        }
      }
    }
    ownerType
    trackItemImpressions
    artworksConnection(first: $first) {
      edges {
        node {
          isDisliked @include(if: $enableHidingDislikedArtworks)
          internalID
          ...ArtworkRail_artworks
          ...GenericGrid_artworks
        }
      }
    }
  }
`

const homeViewSectionArtworksQuery = graphql`
  query HomeViewSectionArtworksQuery($id: String!, $enableHidingDislikedArtworks: Boolean!) {
    homeView {
      section(id: $id) {
        ...HomeViewSectionArtworks_section
          @arguments(enableHidingDislikedArtworks: $enableHidingDislikedArtworks)
      }
    }
  }
`

export const HomeViewSectionArtworksPlaceholder: React.FC<FlexProps> = (flexProps) => {
  const randomValue = useMemoizedRandom()

  return (
    <Skeleton>
      <Flex {...flexProps}>
        <Flex mx={2}>
          <SkeletonText variant="sm-display">Artworks Rail</SkeletonText>
          <Spacer y={2} />

          <Flex flexDirection="row">
            <Join separator={<Spacer x={2} />}>
              {times(2 + randomValue * 10).map((index) => (
                <Flex key={index}>
                  <SkeletonBox
                    height={ARTWORK_RAIL_CARD_IMAGE_HEIGHT}
                    width={ARTWORK_RAIL_CARD_MIN_WIDTH * 2}
                  />
                  <Spacer y={1} />

                  <Join separator={<Spacer y={0.5} />}>
                    <SkeletonBox height={15} width={60} />
                    <SkeletonBox height={15} width={100} />
                    <SkeletonBox height={15} width={120} />
                    <SkeletonBox height={15} width={80} />
                    <SkeletonBox height={15} width={110} />
                  </Join>
                </Flex>
              ))}
            </Join>
          </Flex>
        </Flex>
      </Flex>
    </Skeleton>
  )
}

export const HomeViewSectionArtworksQueryRenderer: React.FC<SectionSharedProps> = memo(
  withSuspense({
    Component: ({ sectionID, index, refetchKey, ...flexProps }) => {
      const enableHidingDislikedArtworks = useFeatureFlag("AREnableHidingDislikedArtworks")
      const { enabled: enableLiveRecommendations } = useEnableLiveHomeRecommendations()

      const isLiveRecommendationsRail =
        enableLiveRecommendations && sectionID === RECOMMENDED_ARTWORKS_SECTION_ID

      const data = useLazyLoadQuery<HomeViewSectionArtworksQuery>(
        homeViewSectionArtworksQuery,
        {
          id: sectionID,
          enableHidingDislikedArtworks,
        },
        {
          // Live sections refresh via their own forced fetchQuery, so they ignore the shared
          // refetchKey to avoid a double fetch.
          fetchKey: isLiveRecommendationsRail ? undefined : refetchKey,
          fetchPolicy: "store-and-network",
        }
      )

      if (!data.homeView.section) {
        return null
      }

      return (
        <HomeViewSectionArtworks section={data.homeView.section} index={index} {...flexProps} />
      )
    },
    LoadingFallback: HomeViewSectionArtworksPlaceholder,
    ErrorFallback: NoFallback,
  })
)
