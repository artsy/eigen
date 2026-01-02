import { ContextModule, ScreenOwnerType } from "@artsy/cohesion"
import { TextProps, useSpace } from "@artsy/palette-mobile"
import { FlashList, FlashListProps, ListRenderItem } from "@shopify/flash-list"
import { PriceOfferMessage } from "app/Components/ArtworkGrids/ArtworkGridItem"
import { MasonryArtworkGridItem } from "app/Components/ArtworkGrids/MasonryArtworkGridItem"
import { PartnerOffer } from "app/Scenes/Activity/components/PartnerOfferCreatedNotification"
import {
  MASONRY_LIST_PAGE_SIZE,
  MasonryArtworkItem,
  NUM_COLUMNS_MASONRY,
} from "app/utils/masonryHelpers"
import { AnimatedMasonryListFooter } from "app/utils/masonryHelpers/AnimatedMasonryListFooter"
import React, { FC, useCallback, useMemo } from "react"
import Animated from "react-native-reanimated"

type MasonryFlashListOmittedProps = Omit<FlashListProps<MasonryArtworkItem>, "renderItem" | "data">

interface MasonryInfiniteScrollArtworkGridProps extends MasonryFlashListOmittedProps {
  animated?: boolean
  artistNamesTextStyle?: TextProps
  artworks: MasonryArtworkItem[]
  contextModule?: ContextModule
  contextScreen?: ScreenOwnerType
  contextScreenOwnerId?: string
  contextScreenOwnerSlug?: string
  contextScreenOwnerType?: ScreenOwnerType
  /** Do not show add to artworks list prompt */
  disableArtworksListPrompt?: boolean
  disableProgressiveOnboarding?: boolean
  hasMore?: boolean
  hideCreateAlertOnArtworkPreview?: boolean
  hideCuratorsPick?: boolean
  hideIncreasedInterest?: boolean
  hidePartner?: boolean
  hideSaleInfo?: boolean
  hideSaveIcon?: boolean
  hideViewFollowsLink?: boolean
  isLoading?: boolean
  loadMore?: (pageSize: number) => void
  onPress?: (artworkID: string) => void
  pageSize?: number
  partnerOffer?: PartnerOffer | null
  priceOfferMessage?: PriceOfferMessage
  saleInfoTextStyle?: TextProps
  trackTap?: (artworkSlug: string, itemIndex?: number) => void
}

/**
 * Reusable component for displaying a masonry grid of artworks with infinite scroll.
 * Note that it is only intended to be used for full screen grids. If you want to use
 * a masonry grid in a Tab surface, use Tabs.Masonry instead.
 *
 */

export const MasonryInfiniteScrollArtworkGrid: React.FC<MasonryInfiniteScrollArtworkGridProps> = ({
  animated = false,
  artistNamesTextStyle,
  artworks,
  contextModule,
  contextScreen,
  contextScreenOwnerId,
  contextScreenOwnerSlug,
  contextScreenOwnerType,
  disableArtworksListPrompt,
  disableProgressiveOnboarding,
  hasMore,
  hideCreateAlertOnArtworkPreview,
  hideCuratorsPick,
  hideIncreasedInterest,
  hidePartner,
  hideSaleInfo,
  hideSaveIcon,
  isLoading,
  ListEmptyComponent,
  ListFooterComponent,
  ListHeaderComponent,
  loadMore,
  onPress,
  onViewableItemsChanged,
  pageSize = MASONRY_LIST_PAGE_SIZE,
  partnerOffer,
  priceOfferMessage,
  refreshControl,
  saleInfoTextStyle,
  scrollEnabled = true,
  trackTap,
  viewabilityConfig,
  ...rest
}) => {
  const space = useSpace()
  const shouldDisplaySpinner = !!artworks.length && !!isLoading && !!hasMore
  const shouldDisplayHeader = !!artworks.length && ListHeaderComponent !== undefined

  const onEndReached = useCallback(() => {
    if (!!hasMore && !isLoading && !!loadMore) {
      loadMore?.(pageSize)
    }
  }, [hasMore, isLoading, loadMore, pageSize])

  const renderItem: ListRenderItem<MasonryArtworkItem> = useCallback(
    ({ item, index }) => {
      return (
        <MasonryArtworkGridItem
          artistNamesTextStyle={artistNamesTextStyle}
          artworkMetaStyle={{
            // Since the grid is full width,
            // we need to add padding to the artwork meta to make sure its readable
            marginLeft: rest.numColumns !== 1 ? 0 : space(2),
            // Extra space between items for one column artwork grids
            paddingBottom: rest.numColumns !== 1 ? 0 : artworks.length === 1 ? space(2) : space(4),
          }}
          contextModule={contextModule}
          contextScreen={contextScreen}
          contextScreenOwnerId={contextScreenOwnerId}
          contextScreenOwnerSlug={contextScreenOwnerSlug}
          contextScreenOwnerType={contextScreenOwnerType}
          disableArtworksListPrompt={disableArtworksListPrompt}
          disableProgressiveOnboarding={disableProgressiveOnboarding}
          fullWidth={rest.numColumns === 1}
          hideCreateAlertOnArtworkPreview={hideCreateAlertOnArtworkPreview}
          hideCuratorsPickSignal={hideCuratorsPick}
          hideIncreasedInterestSignal={hideIncreasedInterest}
          hidePartner={hidePartner}
          hideSaleInfo={hideSaleInfo}
          hideSaveIcon={hideSaveIcon}
          index={index}
          item={item}
          numColumns={rest.numColumns}
          onPress={onPress}
          partnerOffer={partnerOffer}
          priceOfferMessage={priceOfferMessage}
          saleInfoTextStyle={saleInfoTextStyle}
          trackTap={trackTap}
        />
      )
    },
    [
      artistNamesTextStyle,
      artworks.length,
      contextModule,
      contextScreen,
      contextScreenOwnerId,
      contextScreenOwnerSlug,
      contextScreenOwnerType,
      disableArtworksListPrompt,
      disableProgressiveOnboarding,
      hideCreateAlertOnArtworkPreview,
      hideCuratorsPick,
      hideIncreasedInterest,
      hidePartner,
      hideSaleInfo,
      hideSaveIcon,
      onPress,
      partnerOffer,
      priceOfferMessage,
      rest.numColumns,
      saleInfoTextStyle,
      space,
      trackTap,
    ]
  )

  const FlashlistComponent = animated ? AnimatedMasonryFlashList : FlashList

  const getAdjustedNumColumns = useCallback(() => {
    return rest.numColumns ?? NUM_COLUMNS_MASONRY
  }, [rest.numColumns])

  const flashlistComponentProps = useMemo(() => {
    return {
      keyboardShouldPersistTaps: "handled",
      ListHeaderComponent: shouldDisplayHeader ? ListHeaderComponent : null,
      ListEmptyComponent: ListEmptyComponent,
      refreshControl: refreshControl,
      scrollEnabled: scrollEnabled,
      onScroll: rest.onScroll,
      testID: "masonry-artwork-grid",
      masonry: true,
    } satisfies Omit<FlashListProps<MasonryArtworkItem>, "numColumns" | "data" | "renderItem">
  }, [
    shouldDisplayHeader,
    ListHeaderComponent,
    ListEmptyComponent,
    refreshControl,
    scrollEnabled,
    rest.onScroll,
  ])

  if (artworks.length === 0) {
    return (
      <FlashlistComponent
        data={[]}
        renderItem={() => null}
        {...flashlistComponentProps}
        numColumns={NUM_COLUMNS_MASONRY}
        contentContainerStyle={{
          // No paddings are needed for single column grids
          paddingHorizontal: space(2),
        }}
      />
    )
  }

  return (
    <FlashlistComponent
      {...flashlistComponentProps}
      data={artworks}
      keyExtractor={(item) => item.id}
      numColumns={getAdjustedNumColumns()}
      renderItem={renderItem}
      ListFooterComponent={() =>
        hasMore ? (
          <Footer ListFooterComponent={ListFooterComponent} isLoading={shouldDisplaySpinner} />
        ) : null
      }
      onEndReached={onEndReached}
      contentContainerStyle={{
        // No paddings are needed for single column grids
        paddingHorizontal: getAdjustedNumColumns() === 1 ? 0 : space(1),
      }}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
    />
  )
}

const Footer: FC<{
  ListFooterComponent: React.ComponentType<any> | React.ReactElement | null | undefined
  isLoading: boolean
}> = ({ ListFooterComponent, isLoading }) => {
  if (!ListFooterComponent) {
    return <AnimatedMasonryListFooter shouldDisplaySpinner={isLoading} />
  }

  if (React.isValidElement(ListFooterComponent)) {
    return ListFooterComponent
  }

  const Component = ListFooterComponent as React.ComponentType<any>
  return <Component />
}

const AnimatedMasonryFlashList = Animated.createAnimatedComponent(
  FlashList
) as unknown as typeof FlashList
