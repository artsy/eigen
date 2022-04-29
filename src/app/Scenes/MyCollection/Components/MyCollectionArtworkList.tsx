import { MyCollectionArtworkList_myCollectionConnection$key } from "__generated__/MyCollectionArtworkList_myCollectionConnection.graphql"
import { Props as InfiniteScrollArtworksGridProps } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { PAGE_SIZE } from "app/Components/constants"
import { PrefetchFlatList } from "app/Components/PrefetchFlatList"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/useScreenDimensions"
import { Flex, Spinner } from "palette"
import React, { useState } from "react"
import { LayoutAnimation, LayoutChangeEvent, Platform, ScrollView, View } from "react-native"
import { RelayPaginationProp, useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { MyCollectionArtworkListItem } from "./MyCollectionArtworkListItem"

export interface MyCollectionArtworkListProps {
  myCollectionConnection: MyCollectionArtworkList_myCollectionConnection$key | null
  localSortAndFilterArtworks?: (artworks: any[]) => any[]
  loadMore: RelayPaginationProp["loadMore"]
  hasMore: RelayPaginationProp["hasMore"]
  isLoading: RelayPaginationProp["isLoading"]
  HeaderComponent?: InfiniteScrollArtworksGridProps["HeaderComponent"]

  /** Hide the header initially when rendered. Default is false */
  hideHeaderInitially?: boolean
}

export const MyCollectionArtworkList: React.FC<MyCollectionArtworkListProps> = ({
  localSortAndFilterArtworks,
  isLoading,
  loadMore,
  hasMore,
  HeaderComponent,
  hideHeaderInitially = false,
  ...restProps
}) => {
  console.log("myCollectionConnection", restProps.myCollectionConnection)
  const { height: screenHeight } = useScreenDimensions()

  const [headerHeight, setHeaderHeight] = useState(0)
  const [marginTop, setMarginTop] = useState(0)

  const artworkConnection = useFragment<MyCollectionArtworkList_myCollectionConnection$key>(
    artworkConnectionFragment,
    restProps.myCollectionConnection
  )

  const artworks = extractNodes(artworkConnection)
  const preprocessedArtworks = localSortAndFilterArtworks?.(artworks) ?? artworks

  const [loadingMoreData, setLoadingMoreData] = useState(false)

  const loadMoreArtworks = () => {
    if (!hasMore() || isLoading()) {
      return
    }

    setLoadingMoreData(true)

    loadMore(PAGE_SIZE, (error) => {
      if (error) {
        console.log(error.message)
      }

      setLoadingMoreData(false)
    })
  }

  const onHeaderLayout = (event: LayoutChangeEvent) => {
    setHeaderHeight(event.nativeEvent.layout.height)
    if (Platform.OS === "android") {
      setMarginTop(event.nativeEvent.layout.height)
    }
  }

  const renderHeader = () => {
    if (!HeaderComponent) {
      return null
    }

    return React.isValidElement(HeaderComponent) ? (
      <View onLayout={onHeaderLayout}>{HeaderComponent}</View>
    ) : (
      <View onLayout={onHeaderLayout}>
        <HeaderComponent />
      </View>
    )
  }

  return (
    <ScrollView
      testID="MyCollectionArtworkListScrollView"
      // [Android ContentOffset Bug]: See Hacks.MD for why we are using marginTop here to hide header
      contentContainerStyle={
        Platform.OS === "android" && hideHeaderInitially ? { marginTop: -marginTop } : undefined
      }
      // [Android ContentOffset Bug]: contentOffset not working on android. This will only apply to iOS. See Hacks.MD
      contentOffset={hideHeaderInitially ? { x: 0, y: headerHeight } : undefined}
    >
      {/*
       * Rendering a header here instead of passing the header as ListHeaderComponent
       * to PrefetchFlatlist because this Component is nested inside StickyTabPage's Flatlist,
       * therefore PrefetchFlatList will not inherit ScrollViewProps and so we cannot use
       * contentOffset in PrefetchFlatlist
       */}
      {renderHeader()}
      <PrefetchFlatList
        onScroll={
          // [Android ContentOffset Bug]: See Hacks.MD
          Platform.OS === "android"
            ? ({ nativeEvent }) => {
                if (nativeEvent.contentOffset.y - 0 === 0) {
                  LayoutAnimation.configureNext({
                    ...LayoutAnimation.Presets.linear,
                    duration: 200,
                  })
                  setMarginTop(0)
                }
              }
            : undefined
        }
        style={{ minHeight: screenHeight }}
        data={preprocessedArtworks}
        renderItem={({ item }) => <MyCollectionArtworkListItem artwork={item} />}
        // TODO: Add prefetching for this list when the new artwork detail screen is ready
        // prefetchUrlExtractor={(artwork) => `/my-collection/artwork/${artwork.slug}`}
        // prefetchVariablesExtractor={(artwork) => ({
        //   artworkSlug: artwork.slug,
        //   medium: artwork.medium,
        //   artistInternalID: artwork.artist?.internalID,
        // })}
        onEndReached={loadMoreArtworks}
        keyExtractor={(item, index) => String(item.slug || index)}
        ListFooterComponent={
          loadingMoreData ? (
            <Flex mx="auto" mb={15} mt={15}>
              <Spinner />
            </Flex>
          ) : null
        }
      />
    </ScrollView>
  )
}

export const artworkConnectionFragment = graphql`
  fragment MyCollectionArtworkList_myCollectionConnection on MyCollectionConnection {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        ...MyCollectionArtworkListItem_artwork
        ...MyCollectionArtworks_filterProps @relay(mask: false)
      }
    }
  }
`
