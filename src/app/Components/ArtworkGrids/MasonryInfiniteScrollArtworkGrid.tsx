import { ScreenOwnerType } from "@artsy/cohesion"
import { useSpace } from "@artsy/palette-mobile"
import { MasonryFlashList, MasonryFlashListProps } from "@shopify/flash-list"
import { MasonryArtworkGridItem } from "app/Components/ArtworkGrids/MasonryArtworkGridItem"
import { PAGE_SIZE } from "app/Components/constants"
import { useNavigateToPageableRoute } from "app/system/navigation/useNavigateToPageableRoute"
import {
  ESTIMATED_MASONRY_ITEM_SIZE,
  MasonryArtworkItem,
  MasonryListFooterComponent,
  NUM_COLUMNS_MASONRY,
  ON_END_REACHED_THRESHOLD_MASONRY,
  masonryRenderItemProps,
} from "app/utils/masonryHelpers"
import { useCallback } from "react"
import Animated from "react-native-reanimated"

type MasonryFlashListOmittedProps = Omit<
  MasonryFlashListProps<MasonryArtworkItem[]>,
  "renderItem" | "data"
>

interface MasonryInfiniteScrollArtworkGridProps extends MasonryFlashListOmittedProps {
  animated?: boolean
  artworks: MasonryArtworkItem[]
  contextScreen?: ScreenOwnerType
  contextScreenOwnerId?: string
  contextScreenOwnerSlug?: string
  contextScreenOwnerType?: ScreenOwnerType
  hasMore?: boolean
  isLoading?: boolean
  loadMore?: (pageSize: number) => void
  pageSize?: number
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
  contextScreen,
  contextScreenOwnerId,
  contextScreenOwnerSlug,
  contextScreenOwnerType,
  hasMore,
  isLoading,
  ListEmptyComponent,
  ListHeaderComponent,
  loadMore,
  pageSize = PAGE_SIZE,
  refreshControl,
  ...rest
}) => {
  const space = useSpace()
  const { navigateToPageableRoute } = useNavigateToPageableRoute({ items: artworks })
  const shouldDisplaySpinner = !!artworks.length && !!isLoading && !!hasMore
  const shouldDisplayHeader = !!artworks.length && ListHeaderComponent !== undefined

  const onEndReached = useCallback(() => {
    if (!!hasMore && !isLoading && !!loadMore) {
      loadMore?.(pageSize)
    }
  }, [hasMore, isLoading])

  const renderItem = ({ item, index, columnIndex }: masonryRenderItemProps) => (
    <MasonryArtworkGridItem
      index={index}
      item={item}
      columnIndex={columnIndex}
      navigateToPageableRoute={navigateToPageableRoute}
      contextScreenOwnerType={contextScreenOwnerType}
      contextScreen={contextScreen}
      contextScreenOwnerId={contextScreenOwnerId}
      contextScreenOwnerSlug={contextScreenOwnerSlug}
    />
  )

  const FlashlistComponent = animated ? AnimatedFlashList : MasonryFlashList

  return (
    <FlashlistComponent
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingHorizontal: space(2), paddingBottom: space(6) }}
      data={artworks}
      keyExtractor={(item) => item.id}
      onEndReached={onEndReached}
      onEndReachedThreshold={ON_END_REACHED_THRESHOLD_MASONRY}
      numColumns={NUM_COLUMNS_MASONRY}
      estimatedItemSize={ESTIMATED_MASONRY_ITEM_SIZE}
      ListHeaderComponent={shouldDisplayHeader ? ListHeaderComponent : null}
      ListEmptyComponent={ListEmptyComponent}
      refreshControl={refreshControl}
      renderItem={renderItem}
      ListFooterComponent={
        <MasonryListFooterComponent shouldDisplaySpinner={shouldDisplaySpinner} />
      }
      onScroll={rest.onScroll}
    />
  )
}

const AnimatedFlashList = Animated.createAnimatedComponent(
  MasonryFlashList
) as unknown as typeof MasonryFlashList
