import { PAGE_SIZE } from "app/Components/constants"
import { ZeroState } from "app/Components/States/ZeroState"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"

import { Flex, Spinner, useSpace } from "palette"
import React, { useState } from "react"
import { FlatList, LayoutChangeEvent, RefreshControl } from "react-native"
import { LoadMoreFn, RefetchFnDynamic } from "react-relay"
import { Options } from "react-relay/relay-hooks/useRefetchableFragmentNode"
import { FragmentRefs } from "relay-runtime"
import SaleListItem, { SaleItemPadder } from "../Components/SaleListItem"

interface AuctionTabContentProps {
  isLoadingNext: boolean
  isLoadingPrevious: boolean
  refetch: RefetchFnDynamic<any, any, Options>
  hasNext: boolean
  loadNext: LoadMoreFn<any>
  data: Array<{
    " $fragmentRefs": FragmentRefs<"SaleListItem_sale">
    isPadder?: boolean
  }>
  zeroStateTitle: string
  zeroStateSubtitle: string
}
export const AuctionTabContent: React.FC<AuctionTabContentProps> = (props) => {
  const {
    data,
    loadNext,
    hasNext,
    isLoadingNext,
    isLoadingPrevious,
    refetch,
    zeroStateSubtitle,
    zeroStateTitle,
  } = props

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [loadingMoreData, setLoadingMoreData] = useState(false)
  const [availableWidth, setAvailableWidth] = useState(0)
  const [columnCount, setColumnCount] = useState(2)

  const handleRefresh = () => {
    if (isRefreshing || isLoadingNext || isLoadingPrevious) {
      return
    }
    setIsRefreshing(true)
    refetch({}, { onComplete: () => setIsRefreshing(false) })
  }

  const loadMore = () => {
    if (isRefreshing || !hasNext) {
      return
    }

    setLoadingMoreData(true)

    loadNext(PAGE_SIZE, { onComplete: () => setLoadingMoreData(false) })
  }

  const onLayout = (event: LayoutChangeEvent) => {
    const layout = event.nativeEvent.layout
    if (layout.width !== availableWidth) {
      // this means we've rotated or are on our initial load
      const isPad = layout.width > 600
      const isPadHorizontal = layout.width > 900
      const columns = isPad ? (isPadHorizontal ? 4 : 3) : 2
      setColumnCount(columns)
      setAvailableWidth(layout.width)
    }
  }

  const space = useSpace()

  // pads the data with empty obj so that items are not spread too much
  // important for when on a pad and the number of columns is much more
  const paddedData = () => {
    const padded = [...data]
    const extraNeeded = data.length % columnCount
    if (extraNeeded > 0) {
      for (let i = 0; i < extraNeeded; i++) {
        padded.push({ ...data[0], isPadder: true })
      }
    }
    return padded
  }

  return (
    <StickyTabPageScrollView paddingHorizontal={0}>
      <FlatList
        key={"changing_num_cols" + columnCount} // in order to change numColumns on the fly
        onLayout={onLayout}
        columnWrapperStyle={{ justifyContent: "space-between", marginHorizontal: space(1) }}
        data={[...paddedData()]}
        numColumns={columnCount}
        renderItem={({ item, index }) => {
          if (!!item.isPadder) {
            return <SaleItemPadder key={index + "padder"} columnCount={columnCount} />
          }
          return <SaleListItem key={index + "" + item} sale={item} columnCount={columnCount} />
        }}
        onEndReached={loadMore}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
        ListFooterComponent={
          loadingMoreData ? (
            <Flex mx="auto" mb={15} mt={15}>
              <Spinner />
            </Flex>
          ) : null
        }
        ListEmptyComponent={<ZeroState title={zeroStateTitle} subtitle={zeroStateSubtitle} />}
      />
    </StickyTabPageScrollView>
  )
}
