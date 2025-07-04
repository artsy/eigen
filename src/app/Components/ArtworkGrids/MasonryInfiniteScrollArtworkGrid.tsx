import { ContextModule, ScreenOwnerType } from "@artsy/cohesion"
import { useSpace } from "@artsy/palette-mobile"
import { FlashListProps, MasonryFlashList, MasonryFlashListProps } from "@shopify/flash-list"
import { PriceOfferMessage } from "app/Components/ArtworkGrids/ArtworkGridItem"
import { MasonryArtworkGridItem } from "app/Components/ArtworkGrids/MasonryArtworkGridItem"
import { PartnerOffer } from "app/Scenes/Activity/components/PartnerOfferCreatedNotification"
import {
  ESTIMATED_MASONRY_ITEM_SIZE,
  MASONRY_LIST_PAGE_SIZE,
  MasonryArtworkItem,
  NUM_COLUMNS_MASONRY,
  masonryRenderItemProps,
} from "app/utils/masonryHelpers"
import { AnimatedMasonryListFooter } from "app/utils/masonryHelpers/AnimatedMasonryListFooter"
import React, { FC, useCallback, useMemo } from "react"
import Animated from "react-native-reanimated"

type MasonryFlashListOmittedProps = Omit<
  MasonryFlashListProps<MasonryArtworkItem[]>,
  "renderItem" | "data"
>

interface MasonryInfiniteScrollArtworkGridProps extends MasonryFlashListOmittedProps {
  animated?: boolean
  artworks: MasonryArtworkItem[]
  contextModule?: ContextModule
  contextScreen?: ScreenOwnerType
  contextScreenOwnerId?: string
  contextScreenOwnerSlug?: string
  contextScreenOwnerType?: ScreenOwnerType
  hasMore?: boolean
  hideSaleInfo?: boolean
  hideSaveIcon?: boolean
  isLoading?: boolean
  loadMore?: (pageSize: number) => void
  onPress?: (artworkID: string) => void
  pageSize?: number
  partnerOffer?: PartnerOffer | null
  priceOfferMessage?: PriceOfferMessage
}

/**
 * Reusable component for displaying a masonry grid of artworks with infinite scroll.
 * Note that it is only intended to be used for full screen grids. If you want to use
 * a masonry grid in a Tab surface, use Tabs.Masonry instead.
 *
 */

export const MasonryInfiniteScrollArtworkGrid: React.FC<MasonryInfiniteScrollArtworkGridProps> = ({
  animated = false,
  artworks,
  contextModule,
  contextScreen,
  contextScreenOwnerId,
  contextScreenOwnerSlug,
  contextScreenOwnerType,
  hasMore,
  hideSaleInfo,
  hideSaveIcon,
  isLoading,
  ListEmptyComponent,
  ListHeaderComponent,
  loadMore,
  onPress,
  pageSize = MASONRY_LIST_PAGE_SIZE,
  partnerOffer,
  priceOfferMessage,
  refreshControl,
  ListFooterComponent,
  onViewableItemsChanged,
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

  const renderItem = useCallback(
    ({ item, index, columnIndex }: masonryRenderItemProps) => (
      <MasonryArtworkGridItem
        index={index}
        item={item}
        columnIndex={columnIndex}
        contextModule={contextModule}
        contextScreenOwnerType={contextScreenOwnerType}
        contextScreen={contextScreen}
        contextScreenOwnerId={contextScreenOwnerId}
        contextScreenOwnerSlug={contextScreenOwnerSlug}
        numColumns={rest.numColumns}
        artworkMetaStyle={{
          // Since the grid is full width,
          // we need to add padding to the artwork meta to make sure its readable
          paddingHorizontal: rest.numColumns !== 1 ? 0 : space(2),
          // Extra space between items for one column artwork grids
          paddingBottom: rest.numColumns !== 1 ? 0 : artworks.length === 1 ? space(2) : space(4),
        }}
        partnerOffer={partnerOffer}
        priceOfferMessage={priceOfferMessage}
        onPress={onPress}
        hideSaleInfo={hideSaleInfo}
        hideSaveIcon={hideSaveIcon}
      />
    ),
    [
      contextModule,
      contextScreenOwnerType,
      contextScreen,
      contextScreenOwnerId,
      contextScreenOwnerSlug,
      rest.numColumns,
      space,
      artworks.length,
      partnerOffer,
      priceOfferMessage,
      onPress,
      hideSaleInfo,
      hideSaveIcon,
    ]
  )

  const FlashlistComponent = animated ? AnimatedMasonryFlashList : MasonryFlashList

  const getAdjustedNumColumns = useCallback(() => {
    return rest.numColumns ?? NUM_COLUMNS_MASONRY
  }, [rest.numColumns])

  const flashlistComponentProps = useMemo(() => {
    return {
      keyboardShouldPersistTaps: "handled",
      ListHeaderComponent: shouldDisplayHeader ? ListHeaderComponent : null,
      ListEmptyComponent: ListEmptyComponent,
      refreshControl: refreshControl,
      onScroll: rest.onScroll,
      testID: "masonry-artwork-grid",
    } satisfies Omit<FlashListProps<MasonryArtworkItem>, "numColumns" | "data" | "renderItem">
  }, [shouldDisplayHeader, ListHeaderComponent, ListEmptyComponent, refreshControl, rest.onScroll])

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
      data={artworks as unknown as readonly MasonryArtworkItem[]}
      keyExtractor={(item) => item.id}
      numColumns={getAdjustedNumColumns()}
      renderItem={renderItem}
      ListFooterComponent={
        hasMore ? (
          <Footer ListFooterComponent={ListFooterComponent} isLoading={shouldDisplaySpinner} />
        ) : null
      }
      estimatedItemSize={ESTIMATED_MASONRY_ITEM_SIZE}
      onEndReached={onEndReached}
      contentContainerStyle={{
        // No paddings are needed for single column grids
        paddingHorizontal: getAdjustedNumColumns() === 1 ? 0 : space(2),
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
  MasonryFlashList
) as unknown as typeof MasonryFlashList
