import { Flex } from "@artsy/palette-mobile"
import { InfiniteDiscoveryArtworkCard } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryArtworkCard"
import { InfiniteDiscoveryArtwork } from "app/Scenes/InfiniteDiscovery/InfiniteDiscovery"
import { GlobalStore } from "app/store/GlobalStore"
import { memo, useRef } from "react"
import { Dimensions, FlatList } from "react-native"

export type FancySwiperArtworkCard = {
  content: React.ReactNode
  artworkId: string
}

interface InfiniteSwiperCardsCarouselProps {
  artworks: InfiniteDiscoveryArtwork[]
  fetchMoreArtworks: (undiscoveredArtworkIds?: string[]) => void
  setIndex: (index: number) => void
}

const CARD_WIDTH = Dimensions.get("window").width

export interface ViewableItems {
  viewableItems: ViewToken[]
}

interface ViewToken {
  item?: InfiniteDiscoveryArtwork
  key?: string
  index?: number | null
  isViewable?: boolean
}

export const InfiniteSwiperCardsCarousel: React.FC<InfiniteSwiperCardsCarouselProps> = memo(
  ({ artworks, fetchMoreArtworks, setIndex }) => {
    const { addDisoveredArtworkId } = GlobalStore.actions.infiniteDiscovery

    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 30 })
    const viewableItemsChangedRef = useRef(({ viewableItems }: ViewableItems) => {
      const artworkOnScreen = viewableItems.find((viewableItem) => viewableItem.isViewable)
      if (artworkOnScreen?.index && artworkOnScreen.key) {
        setIndex(artworkOnScreen.index)
        addDisoveredArtworkId(artworkOnScreen.key)
      }
    })

    const data = artworks.map((artwork) => ({
      key: artwork.internalID,
      content: (
        <Flex width={CARD_WIDTH}>
          <InfiniteDiscoveryArtworkCard artwork={artwork} key={artwork.internalID} />
        </Flex>
      ),
    }))

    return (
      <Flex flex={1}>
        <FlatList
          data={data}
          renderItem={({ item }: { item: { key: string; content: JSX.Element } }) => item.content}
          horizontal
          pagingEnabled
          // @ts-ignore
          onViewableItemsChanged={viewableItemsChangedRef.current}
          viewabilityConfig={viewConfigRef.current}
          onEndReached={() => {
            fetchMoreArtworks([data[data.length - 1].key])
          }}
        />
      </Flex>
    )
  }
)
