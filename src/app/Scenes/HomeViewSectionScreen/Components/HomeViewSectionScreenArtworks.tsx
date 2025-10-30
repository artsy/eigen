import { ContextModule, OwnerType, ScreenOwnerType } from "@artsy/cohesion"
import { CloseIcon, FullWidthIcon, GridIcon } from "@artsy/icons/native"
import {
  DEFAULT_HIT_SLOP,
  Flex,
  Screen,
  SimpleMessage,
  Text,
  Touchable,
  useScreenDimensions,
} from "@artsy/palette-mobile"
import { HomeViewSectionScreenArtworks_section$key } from "__generated__/HomeViewSectionScreenArtworks_section.graphql"
import { HomeViewSectionScreenQuery } from "__generated__/HomeViewSectionScreenQuery.graphql"
import { ArtworkCard } from "app/Components/ArtworkCard/ArtworkCard"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { PAGE_SIZE, SCROLLVIEW_PADDING_BOTTOM_OFFSET } from "app/Components/constants"
import { useItemsImpressionsTracking } from "app/Scenes/HomeView/hooks/useImpressionsTracking"
import { useSetPriceRangeReminder } from "app/Scenes/HomeViewSectionScreen/hooks/useSetPriceRangeReminder"
import { InfiniteDiscoveryBottomSheet } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheet"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { NUM_COLUMNS_MASONRY } from "app/utils/masonryHelpers"
import { pluralize } from "app/utils/pluralize"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { MotiPressable } from "moti/interactions"
import { useCallback, useState } from "react"
import { ListRenderItem } from "react-native"
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated"
import { graphql, usePaginationFragment } from "react-relay"

const ICON_SIZE = 26

interface ArtworksScreenHomeSection {
  section: HomeViewSectionScreenArtworks_section$key
}

export const HomeViewSectionScreenArtworks: React.FC<ArtworksScreenHomeSection> = (props) => {
  const defaultViewOption = GlobalStore.useAppState((state) => state.userPrefs.defaultViewOption)
  const setDefaultViewOption = GlobalStore.actions.userPrefs.setDefaultViewOption
  const enableNewHomeViewCardRailType = useFeatureFlag("AREnableNewHomeViewCardRailType")
  const { width, height } = useScreenDimensions()
  const scrollX = useSharedValue(0)
  const [activeIndex, setActiveIndex] = useState(0)

  const {
    data: section,
    isLoadingNext,
    loadNext,
    refetch,
    hasNext,
  } = usePaginationFragment<HomeViewSectionScreenQuery, HomeViewSectionScreenArtworks_section$key>(
    artworksFragment,
    props.section
  )

  const { onViewableItemsChanged, viewabilityConfig } = useItemsImpressionsTracking({
    isInViewport: true,
    contextModule: ContextModule.artworkGrid,
    contextScreenOwnerType: section.ownerType as OwnerType,
  })

  const artworks = extractNodes(section?.artworksConnection)

  const RefreshControl = useRefreshControl(refetch)

  const { scrollHandler } = Screen.useListenForScreenScroll()

  const numOfColumns = defaultViewOption === "grid" ? NUM_COLUMNS_MASONRY : 1

  useSetPriceRangeReminder({
    artworksLength: artworks.length,
    totalCount: section.artworksConnection?.totalCount ?? 0,
    sectionInternalID: section.internalID,
    contextScreenOwnerType: section.ownerType as ScreenOwnerType,
  })

  const onScrollHandlerList = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x
    },
  })

  const handleOnEndReached = () => {
    if (hasNext && !isLoadingNext) {
      loadNext(PAGE_SIZE)
    }
  }

  const renderItem = useCallback<ListRenderItem<(typeof artworks)[number]>>(
    ({ item, index }) => (
      <Flex width={width}>
        <ArtworkCard
          artwork={item}
          supportMultipleImages={false}
          showPager={false}
          contextModule={ContextModule.newWorksForYouRail}
          isSaved={!!item.isSaved}
          index={index}
          scrollX={scrollX}
          containerStyle={{ backgroundColor: "transparent" }}
        />
      </Flex>
    ),
    [width, scrollX]
  )

  if (!enableNewHomeViewCardRailType) {
    return (
      <>
        <Screen.AnimatedHeader
          onBack={goBack}
          title={section.component?.title || ""}
          rightElements={
            <MotiPressable
              onPress={() => {
                setDefaultViewOption(defaultViewOption === "list" ? "grid" : "list")
              }}
              style={{ top: 5 }}
            >
              {defaultViewOption === "grid" ? (
                <FullWidthIcon height={ICON_SIZE} width={ICON_SIZE} />
              ) : (
                <GridIcon height={ICON_SIZE} width={ICON_SIZE} />
              )}
            </MotiPressable>
          }
        />

        <Screen.StickySubHeader
          title={section.component?.title || ""}
          Component={
            <Text variant="xs" mt={1}>
              {section.artworksConnection?.totalCount} {pluralize("Artwork", artworks.length)}
            </Text>
          }
        />

        <Screen.Body fullwidth>
          <MasonryInfiniteScrollArtworkGrid
            testID="artwork-grid"
            animated
            artworks={artworks}
            numColumns={numOfColumns}
            disableAutoLayout
            pageSize={PAGE_SIZE}
            ListEmptyComponent={
              <SimpleMessage my={2}>Nothing yet. Please check back later.</SimpleMessage>
            }
            refreshControl={RefreshControl}
            hasMore={hasNext}
            loadMore={() => {
              loadNext(PAGE_SIZE)
            }}
            isLoading={isLoadingNext}
            onScroll={scrollHandler}
            style={{ paddingBottom: SCROLLVIEW_PADDING_BOTTOM_OFFSET }}
            contextScreenOwnerType={section.ownerType as ScreenOwnerType}
            {...(section.trackItemImpressions
              ? {
                  onViewableItemsChanged: onViewableItemsChanged,
                  viewabilityConfig: viewabilityConfig,
                }
              : {})}
          />
        </Screen.Body>
      </>
    )
  }

  return (
    <Screen.Body fullwidth gap={2}>
      <Screen.Header
        rightElements={
          <Touchable
            accessibilityRole="button"
            accessibilityLabel="Exit New Works For you"
            hitSlop={DEFAULT_HIT_SLOP}
            onPress={() => goBack()}
          >
            <CloseIcon />
          </Touchable>
        }
        hideLeftElements
        title="New Works For You"
      />

      <Flex height={height}>
        <Animated.FlatList
          testID="carousel-flatlist"
          data={artworks}
          ListEmptyComponent={
            <SimpleMessage my={2}>Nothing yet. Please check back later.</SimpleMessage>
          }
          keyExtractor={(item: any) => `ArtworkCard-${item.internalID}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          pagingEnabled
          decelerationRate="fast"
          snapToInterval={width}
          snapToAlignment="start"
          snapToEnd={false}
          onScroll={onScrollHandlerList}
          onViewableItemsChanged={({ viewableItems, changed }) => {
            const index = viewableItems[0]?.index
            if (index !== null && index !== activeIndex) {
              setActiveIndex(index)
            }
            if (section.trackItemImpressions) {
              onViewableItemsChanged({ viewableItems, changed })
            }
          }}
          onEndReached={handleOnEndReached}
        />
      </Flex>

      {artworks.length > 0 && !!artworks[activeIndex] && (
        <InfiniteDiscoveryBottomSheet
          artworkID={artworks[activeIndex].internalID}
          artworkSlug={artworks[activeIndex].slug}
          artistIDs={artworks[activeIndex].artists.map((data) => data?.internalID ?? "")}
        />
      )}
    </Screen.Body>
  )
}

export const artworksFragment = graphql`
  fragment HomeViewSectionScreenArtworks_section on HomeViewSectionArtworks
  @refetchable(queryName: "ArtworksScreenHomeSection_viewerRefetch")
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
    internalID
    component {
      title
    }
    ownerType
    contextModule
    trackItemImpressions
    artworksConnection(after: $cursor, first: $count)
      @connection(key: "ArtworksScreenHomeSection_artworksConnection", filters: []) {
      totalCount
      edges {
        node {
          ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
          ...ArtworkCard_artwork

          id
          internalID # This is for tracking
          slug
          href
          isSaved
          artists(shallow: true) @required(action: NONE) {
            internalID
          }
          image(includeAll: false) {
            aspectRatio
            blurhash
          }
        }
      }
    }
  }
`
