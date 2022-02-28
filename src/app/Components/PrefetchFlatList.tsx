import { usePrefetch } from "app/utils/queryPrefetching"
import React, { Ref, useCallback, useReducer, useRef } from "react"
import { FlatList, FlatListProps, ViewToken } from "react-native"

export type PrefetchFlatListProps<ItemType> = {
  prefetchUrlExtractor?: (item?: ItemType) => string | undefined
  prefetchVariablesExtractor?: (item?: ItemType) => object | undefined
  listRef?: Ref<FlatList<ItemType | any> | any>
} & FlatListProps<ItemType>

/**
 * Wraps `FlatList` and prefetches items when they are about to be rendered if `prefetchUrlExtractor` is provided.
 * An item will be prefetched as soon as the item is visible to the user and the user has interacted with the FlatList.
 * @param prefetchUrlExtractor - A function that extracts the prefetch URL from an item.
 * @param prefetchVariablesExtractor - A function that extracts the variables to pass to the prefetch query.
 */
export function PrefetchFlatList<ItemType>({
  onViewableItemsChanged,
  viewabilityConfig,
  prefetchUrlExtractor,
  prefetchVariablesExtractor,
  listRef,
  ...restProps
}: PrefetchFlatListProps<ItemType>) {
  const prefetchUrl = usePrefetch()

  const [viewedUrls, addViewedUrl] = useReducer(
    (state: { [key: string]: boolean }, url: string) => {
      state[url] = true
      return state
    },
    {}
  )

  const viewabilityConfigRef = useRef({
    waitForInteraction: true,
    viewAreaCoveragePercentThreshold: 0,
    ...viewabilityConfig,
  })

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
    <FlatList<ItemType>
      {...restProps}
      onViewableItemsChanged={handleOnViewableItemsChanged}
      viewabilityConfig={viewabilityConfigRef.current}
      ref={listRef}
    />
  )
}
