import { ContextModule, OwnerType, ScreenOwnerType } from "@artsy/cohesion"
import { ChevronRightIcon } from "@artsy/icons/native"
import {
  Flex,
  FlexProps,
  Join,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Button,
  Text,
} from "@artsy/palette-mobile"
import { ArtworkRail_artworks$data } from "__generated__/ArtworkRail_artworks.graphql"
import { ArtworksCard_artworks$data } from "__generated__/ArtworksCard_artworks.graphql"
import { HomeViewSectionArtworksQuery } from "__generated__/HomeViewSectionArtworksQuery.graphql"
import { HomeViewSectionArtworks_section$key } from "__generated__/HomeViewSectionArtworks_section.graphql"
import GenericGrid from "app/Components/ArtworkGrids/GenericGrid"
import { ArtworkRail } from "app/Components/ArtworkRail/ArtworkRail"
import {
  ARTWORK_RAIL_CARD_IMAGE_HEIGHT,
  ARTWORK_RAIL_CARD_MIN_WIDTH,
} from "app/Components/ArtworkRail/ArtworkRailCardImage"
import { ProgressiveOnboardingLongPressContextMenu } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingLongPressContextMenu"
import { SectionTitle } from "app/Components/SectionTitle"
import { ArtworksCard } from "app/Scenes/HomeView/Components/ArtworksCard"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { HomeViewStore } from "app/Scenes/HomeView/HomeViewContext"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { getHomeViewSectionHref } from "app/Scenes/HomeView/helpers/getHomeViewSectionHref"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { useItemsImpressionsTracking } from "app/Scenes/HomeView/hooks/useImpressionsTracking"
import { useExperimentVariant } from "app/system/flags/hooks/useExperimentVariant"
import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { isDislikeArtworksEnabledFor } from "app/utils/isDislikeArtworksEnabledFor"
import { useMemoizedRandom } from "app/utils/placeholders"
import { times } from "lodash"
import { memo } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionArtworksProps extends FlexProps {
  section: HomeViewSectionArtworks_section$key
  index: number
  shouldShowInGrid?: boolean
}

const NUMBER_OF_ARTWORKS_FOR_ARTWORKS_CARD = 3
const DEFAULT_ARTWORKS_FIRST = 10
const ARTWORKS_GRID_SIX_WORKS = 6
const ARTWORKS_GRID_FOUR_WORKS = 4
const NWFY_GRID_EXPERIMENT = "onyx_NWFY-grid-ABC-test"
const NWFY_GRID_VARIANT_COUNTS: Record<string, number> = {
  "grid-six-works": ARTWORKS_GRID_SIX_WORKS,
  "grid-four-works": ARTWORKS_GRID_FOUR_WORKS,
  "grid-no-metadata": ARTWORKS_GRID_SIX_WORKS,
}

const getNwfyGridArtworksCount = (variantName?: string) => {
  if (!variantName) {
    return DEFAULT_ARTWORKS_FIRST
  }

  return NWFY_GRID_VARIANT_COUNTS[variantName] ?? DEFAULT_ARTWORKS_FIRST
}

const isNwfyGridNoMetadata = (variantName?: string) => variantName === "grid-no-metadata"

export const HomeViewSectionArtworks: React.FC<HomeViewSectionArtworksProps> = ({
  section: sectionProp,
  index,
  shouldShowInGrid = false,
  ...flexProps
}) => {
  const tracking = useHomeViewTracking()
  const enableNewHomeViewCardRailType = useFeatureFlag("AREnableNewHomeViewCardRailType")
  const { variant } = useExperimentVariant(NWFY_GRID_EXPERIMENT)
  const hideArtworMetaData = isNwfyGridNoMetadata(variant?.name)

  const section = useFragment(fragment, sectionProp)
  const viewableSections = HomeViewStore.useStoreState((state) => state.viewableSections)

  const { onViewableItemsChanged, viewabilityConfig } = useItemsImpressionsTracking({
    // It is important here to tell if the rail is visible or not, because the viewability config
    // default behavior, doesn't take into account the fact that the rail could be not visible
    // on the screen because it's within a scrollable container.
    isInViewport: viewableSections.includes(section.internalID) && section.trackItemImpressions,
    contextModule: section.contextModule as ContextModule,
  })

  let artworks = extractNodes(section.artworksConnection)
  const artworksCount = section.artworksConnection?.totalCount || 0
  const moreWorksCount =
    artworksCount - NUMBER_OF_ARTWORKS_FOR_ARTWORKS_CARD < 0
      ? "0"
      : (artworksCount - NUMBER_OF_ARTWORKS_FOR_ARTWORKS_CARD).toString()
  const buttonText = `View ${moreWorksCount} More`

  if (isDislikeArtworksEnabledFor(section.contextModule)) {
    artworks = artworks.filter((artwork) => !artwork.isDisliked)
  }

  const viewAll = section.component?.behaviors?.viewAll

  if (!artworks.length) {
    return null
  }

  const handleOnArtworkPress = (
    artwork: ArtworkRail_artworks$data[number] | ArtworksCard_artworks$data[number],
    position: number
  ) => {
    tracking.tappedArtworkGroup(
      artwork.internalID,
      artwork.slug,
      artwork[" $fragmentType"] !== "ArtworksCard_artworks" ? artwork?.collectorSignals : null,
      section.contextModule as ContextModule,
      position
    )
  }

  const showHomeViewCardRail = enableNewHomeViewCardRailType && section.showArtworksCardView
  const isGridEnabled = shouldShowInGrid
  const isGridNoMetadata = isGridEnabled && hideArtworMetaData
  const isGridWithMetadata = isGridEnabled && !hideArtworMetaData
  const showDefaultHeader = !isGridNoMetadata

  const moreHref = getHomeViewSectionHref(viewAll?.href, section, showHomeViewCardRail)

  const onSectionViewAll = () => {
    tracking.tappedArtworkGroupViewAll(
      section.contextModule as ContextModule,
      (viewAll?.ownerType || section.ownerType) as ScreenOwnerType
    )
  }

  const onMorePress = () => {
    tracking.tappedArtworkGroupViewAll(
      section.contextModule as ContextModule,
      (viewAll?.ownerType || section.ownerType) as ScreenOwnerType
    )
  }

  // This is a temporary solution to show the long press context menu only on the first artwork section
  const isFirstArtworkSection = section.contextModule === ContextModule.newWorksForYouRail

  const artowrksForArtworksCards = artworks.slice(0, NUMBER_OF_ARTWORKS_FOR_ARTWORKS_CARD)

  const subTitle =
    showHomeViewCardRail && artworks.length > 0
      ? artowrksForArtworksCards
          .map((artwork) => artwork?.artistNames)
          .filter(Boolean)
          .join(", ")
      : undefined

  return (
    <Flex {...flexProps} backgroundColor={isGridNoMetadata ? "mono100" : "mono0"}>
      {!!showDefaultHeader && (
        <SectionTitle
          href={moreHref}
          mx={2}
          title={section.component?.title}
          subtitle={subTitle}
          onPress={moreHref ? onSectionViewAll : undefined}
          mb={isGridWithMetadata ? 0 : undefined}
        />
      )}

      {!!isGridNoMetadata && (
        <RouterLink to={moreHref} onPress={moreHref ? onSectionViewAll : undefined}>
          <Flex m={2} flexDirection="row" alignItems="flex-start">
            <Flex flex={1}>
              <Text color="mono0" variant="md">
                {section.component?.title}
              </Text>
            </Flex>
            <Flex flexShrink={0} pl={1} my="auto">
              <ChevronRightIcon width={18} fill="mono0" ml={0.5} />
            </Flex>
          </Flex>
        </RouterLink>
      )}

      {!!isFirstArtworkSection && <ProgressiveOnboardingLongPressContextMenu />}

      {isGridWithMetadata ? (
        <Flex mx={2} gap={2}>
          <GenericGrid artworks={artworks} />

          <RouterLink to={moreHref} hasChildTouchable>
            <Button block variant="outline">
              View More
            </Button>
          </RouterLink>
        </Flex>
      ) : isGridNoMetadata ? (
        <Flex gap={2} mb={2}>
          <GenericGrid artworks={artworks} hideArtworMetaData />
          <RouterLink
            to={moreHref}
            hasChildTouchable
            style={{
              paddingHorizontal: 20,
            }}
          >
            <Button block variant="outlineLight">
              {buttonText}
            </Button>
          </RouterLink>
        </Flex>
      ) : showHomeViewCardRail ? (
        <ArtworksCard
          href={moreHref}
          onPress={handleOnArtworkPress}
          artworks={artworks}
          contextModule={section.contextModule as ContextModule}
          ownerType={OwnerType.home}
          trackingEnabled={section.trackItemImpressions}
        />
      ) : (
        <ArtworkRail
          contextModule={section.contextModule as ContextModule}
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
        contextModule={section.contextModule as ContextModule}
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
    includeArtistNames: { type: "Boolean", defaultValue: false }
    includeGenericGrid: { type: "Boolean", defaultValue: false }
    artworksFirst: { type: "Int", defaultValue: 10 }
  ) {
    __typename
    internalID
    contextModule
    component {
      title
      behaviors {
        viewAll {
          href
          ownerType
        }
      }
    }
    ownerType
    trackItemImpressions
    showArtworksCardView
    artworksConnection(first: $artworksFirst) {
      totalCount
      edges {
        node {
          isDisliked @include(if: $enableHidingDislikedArtworks)
          artistNames @include(if: $includeArtistNames)
          internalID
          ...ArtworkRail_artworks
          ...ArtworksCard_artworks
          ...GenericGrid_artworks @include(if: $includeGenericGrid)
        }
      }
    }
  }
`

const homeViewSectionArtworksQuery = graphql`
  query HomeViewSectionArtworksQuery(
    $id: String!
    $enableHidingDislikedArtworks: Boolean!
    $includeArtistNames: Boolean!
    $includeGenericGrid: Boolean!
    $artworksFirst: Int!
  ) {
    homeView {
      section(id: $id) {
        ...HomeViewSectionArtworks_section
          @arguments(
            enableHidingDislikedArtworks: $enableHidingDislikedArtworks
            includeArtistNames: $includeArtistNames
            includeGenericGrid: $includeGenericGrid
            artworksFirst: $artworksFirst
          )
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

// here
export const HomeViewSectionArtworksQueryRenderer: React.FC<SectionSharedProps> = memo(
  withSuspense({
    Component: ({ sectionID, index, refetchKey, shouldShowInGrid, ...flexProps }) => {
      const enableHidingDislikedArtworks = useFeatureFlag("AREnableHidingDislikedArtworks")

      const enableNewHomeViewCardRailType = useFeatureFlag("AREnableNewHomeViewCardRailType")

      const { variant } = useExperimentVariant(NWFY_GRID_EXPERIMENT)
      const artworksToRender = getNwfyGridArtworksCount(variant?.name)

      const includeArtistNames = enableNewHomeViewCardRailType
      const includeGenericGrid = !!shouldShowInGrid
      const artworksFirst = includeGenericGrid ? artworksToRender : DEFAULT_ARTWORKS_FIRST

      const data = useLazyLoadQuery<HomeViewSectionArtworksQuery>(
        homeViewSectionArtworksQuery,
        {
          id: sectionID,
          enableHidingDislikedArtworks,
          includeArtistNames,
          includeGenericGrid,
          artworksFirst,
        },
        {
          fetchKey: refetchKey,
          fetchPolicy: "store-and-network",
        }
      )

      if (!data.homeView.section) {
        return null
      }

      return (
        <HomeViewSectionArtworks
          section={data.homeView.section}
          index={index}
          shouldShowInGrid={shouldShowInGrid}
          {...flexProps}
        />
      )
    },
    LoadingFallback: HomeViewSectionArtworksPlaceholder,
    ErrorFallback: NoFallback,
  })
)
