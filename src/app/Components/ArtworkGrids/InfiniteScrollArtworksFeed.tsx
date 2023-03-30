import { Flex, Spacer, Spinner, useSpace } from "@artsy/palette-mobile"
import { FlashList } from "@shopify/flash-list"
import ArtworkGridItem from "app/Components/ArtworkGrids/ArtworkGridItem"
import { PrivateProps, Props } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { PAGE_SIZE } from "app/Components/constants"
import { useBottomTabBarHeight } from "app/Scenes/BottomTabs/useBottomTabBarHeight"
import { useNavigateToPageableRoute } from "app/system/navigation/useNavigateToPageableRoute"
import { extractNodes } from "app/utils/extractNodes"
import { useState } from "react"
import { Dimensions } from "react-native"

// a rough estimation of each artwork size in pixels
const ESTIMATED_ITEM_SIZE = 420

const HEADER_HEIGHT = 55

export const InfiniteScrollArtworksFeed: React.FC<Props & PrivateProps> = ({
  connection,
  hasMore,
  loadMore,
  localSortAndFilterArtworks,
  isLoading,
  pageSize = PAGE_SIZE,
  itemComponentProps,
  HeaderComponent,
  ...restProps
}) => {
  const space = useSpace()
  const artworks = extractNodes(connection)
  const [localIsLoading, setLocalIsLoading] = useState(false)
  const artworksToRender = (localSortAndFilterArtworks?.(artworks) as typeof artworks) ?? artworks
  const { width, height } = Dimensions.get("screen")

  const fetchNextPage = () => {
    if (!hasMore() || localIsLoading || isLoading?.()) {
      return
    }

    setLocalIsLoading(true)

    loadMore(pageSize!, (error) => {
      setLocalIsLoading(false)
      if (error) {
        // FIXME: Handle error
        console.error("InfiniteScrollGrid.tsx", error.message)
      }
    })
  }

  const { navigateToPageableRoute } = useNavigateToPageableRoute({ items: artworks })

  const bottomTabBarHeight = useBottomTabBarHeight()

  return (
    <Flex height={height - bottomTabBarHeight} paddingBottom={`${bottomTabBarHeight}px`}>
      <FlashList
        ListHeaderComponent={HeaderComponent}
        contentContainerStyle={{ paddingBottom: space(6), paddingHorizontal: space(2) }}
        estimatedItemSize={ESTIMATED_ITEM_SIZE}
        estimatedListSize={{
          height: height - bottomTabBarHeight - HEADER_HEIGHT,
          width: width,
        }}
        data={artworksToRender}
        renderItem={({ item }) => {
          const aspectRatio = item.image?.aspectRatio ?? 1
          const imgWidth = width - space(4)
          const imgHeight = imgWidth / aspectRatio
          return (
            <ArtworkGridItem
              artwork={item as any}
              navigateToPageableRoute={navigateToPageableRoute}
              height={imgHeight}
              {...itemComponentProps}
              {...restProps}
            />
          )
        }}
        ItemSeparatorComponent={() => <Spacer y={6} />}
        keyExtractor={(item) => item.id}
        onEndReached={() => fetchNextPage()}
        onEndReachedThreshold={0.2}
        ListFooterComponent={() => {
          if (hasMore() && !localIsLoading && !isLoading?.()) {
            return (
              <Flex mt={2} mb={4} flexDirection="row" justifyContent="center">
                <Spinner />
              </Flex>
            )
          }
          return null
        }}
      />
    </Flex>
  )
}
