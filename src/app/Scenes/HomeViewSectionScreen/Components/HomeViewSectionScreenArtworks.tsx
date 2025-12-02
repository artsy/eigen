import { ActionType, ContextModule, OwnerType, ScreenOwnerType } from "@artsy/cohesion"
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
import { useRoute } from "@react-navigation/native"
import { HomeViewSectionScreenArtworks_section$key } from "__generated__/HomeViewSectionScreenArtworks_section.graphql"
import { HomeViewSectionScreenQuery } from "__generated__/HomeViewSectionScreenQuery.graphql"
import { ArtworkCard } from "app/Components/ArtworkCard/ArtworkCard"
import { ArtworkCardBottomSheet } from "app/Components/ArtworkCard/ArtworkCardBottomSheet"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { PAGE_SIZE, SCROLLVIEW_PADDING_BOTTOM_OFFSET } from "app/Components/constants"
import { useItemsImpressionsTracking } from "app/Scenes/HomeView/hooks/useImpressionsTracking"
import { HomeViewSectionScreenRouteProp } from "app/Scenes/HomeViewSectionScreen/HomeViewSectionScreen"
import { useSetPriceRangeReminder } from "app/Scenes/HomeViewSectionScreen/hooks/useSetPriceRangeReminder"
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
import { useTracking } from "react-tracking"

const ICON_SIZE = 26

interface ArtworksScreenHomeSection {
  section: HomeViewSectionScreenArtworks_section$key
}

export const HomeViewSectionScreenArtworks: React.FC<ArtworksScreenHomeSection> = (props) => {
  const defaultViewOption = GlobalStore.useAppState((state) => state.userPrefs.defaultViewOption)
  const { params } = useRoute<HomeViewSectionScreenRouteProp>()
  const setDefaultViewOption = GlobalStore.actions.userPrefs.setDefaultViewOption
  const { width, height } = useScreenDimensions()
  const scrollX = useSharedValue(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const { trackEvent } = useTracking()
  const enableNewHomeViewCardRailType = useFeatureFlag("AREnableNewHomeViewCardRailType")
  const isNewWorksForYouCarouselEnabled =
    enableNewHomeViewCardRailType && params.id === "home-view-section-new-works-for-you"

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
    contextModule: isNewWorksForYouCarouselEnabled
      ? ContextModule.artworkCarousel
      : ContextModule.artworkGrid,
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
          contextModule={section.contextModule as ContextModule}
          index={index}
          scrollX={scrollX}
        />
      </Flex>
    ),
    [width, section.contextModule, scrollX]
  )

  if (!isNewWorksForYouCarouselEnabled) {
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
            accessibilityLabel="Exit New Works for You"
            hitSlop={DEFAULT_HIT_SLOP}
            onPress={() => {
              trackEvent({
                action: ActionType.tappedClose,
                context_module: section.contextModule,
              })
              goBack()
            }}
          >
            <CloseIcon />
          </Touchable>
        }
        hideLeftElements
        title={section.component?.title || ""}
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
          initialScrollIndex={parseInt(params.artworkIndex ?? "0")}
          getItemLayout={(_, index) => {
            return {
              index,
              length: width,
              offset: width * index,
            }
          }}
          removeClippedSubviews={false}
          snapToInterval={width}
          snapToAlignment="start"
          disableIntervalMomentum
          snapToEnd={false}
          onScroll={onScrollHandlerList}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={({ viewableItems, changed }) => {
            const index = viewableItems[0]?.index
            if (index != null && index !== activeIndex) {
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
        <ArtworkCardBottomSheet
          artworkID={artworks[activeIndex].internalID}
          artworkSlug={artworks[activeIndex].slug}
          artistIDs={artworks[activeIndex].artists.map((data) => data?.internalID ?? "")}
          contextModule={section.contextModule as ContextModule}
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
