import { FlashList, FlashListProps, ViewToken } from "@shopify/flash-list"
import { usePrefetch } from "app/utils/queryPrefetching"
import { Ref, useCallback, useReducer, useRef } from "react"

const DEFAULT_VIEWABILITY_CONFIG = {
  waitForInteraction: true,
  itemVisiblePercentThreshold: 0,
}

export type PrefetchFlashListProps<ItemType> = {
  prefetchUrlExtractor?: (item?: ItemType) => string | undefined | null
  prefetchVariablesExtractor?: (item?: ItemType) => object | undefined
  listRef?: Ref<FlashList<ItemType | any> | any>
} & FlashListProps<ItemType>

/**
 * Wraps `FlashList` and prefetches items when they are about to be rendered if `prefetchUrlExtractor` is provided.
 * An item will be prefetched as soon as the item is visible to the user and the user has interacted with the FlashList.
 * @param prefetchUrlExtractor - A function that extracts the prefetch URL from an item.
 * @param prefetchVariablesExtractor - A function that extracts the variables to pass to the prefetch query.
 */
export function PrefetchFlashList<ItemType>({
  onViewableItemsChanged,
  viewabilityConfig,
  prefetchUrlExtractor,
  prefetchVariablesExtractor,
  listRef,
  ...restProps
}: PrefetchFlashListProps<ItemType>) {
  const prefetchUrl = usePrefetch()

  const [viewedUrls, addViewedUrl] = useReducer(
    (state: { [key: string]: boolean }, url: string) => {
      state[url] = true
      return state
    },
    {}
  )

  const viewabilityConfigRef = useRef(viewabilityConfig || DEFAULT_VIEWABILITY_CONFIG)

  const handleOnViewableItemsChanged = useCallback(
    ({ changed, viewableItems }: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      onViewableItemsChanged?.({ changed, viewableItems })

      if (!prefetchUrlExtractor) {
        return
      }

      // Prefetch all changed items that have not yet been prefetched
      changed.forEach((item) => {
        const url = prefetchUrlExtractor?.(item.item)
        const variables = prefetchVariablesExtractor?.(item.item)

        if (!url || viewedUrls[url]) {
          return
        }

        addViewedUrl(url)
        prefetchUrl(url, variables)
      })
    },
    []
  )

  return (
    <FlashList<ItemType>
      {...restProps}
      onViewableItemsChanged={handleOnViewableItemsChanged}
      viewabilityConfig={viewabilityConfigRef.current}
      ref={listRef}
    />
  )
}
