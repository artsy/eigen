import { Flex, Spinner, useSpace } from "@artsy/palette-mobile"
import { ArtworkListsQuery } from "__generated__/ArtworkListsQuery.graphql"
import { StickyTabPageFlatList } from "app/Components/StickyTabPage/StickyTabPageFlatList"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { ArtworkListItem } from "app/Scenes/ArtworkLists/ArtworkListItem"
import { useArtworkListsColCount } from "app/Scenes/ArtworkLists/useArtworkListsColCount"
import { extractNodes } from "app/utils/extractNodes"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

const ArtworkLists = () => {
  const space = useSpace()
  const artworkListsColCount = useArtworkListsColCount()

  const data = useLazyLoadQuery<ArtworkListsQuery>(
    artworkListsQuery,
    {},
    { fetchPolicy: "store-and-network" }
  )

  const savedArtworksArtworkList = data.me?.savedArtworksArtworkList!
  const customArtworkLists = extractNodes(data.me?.customArtworkLists)

  const artworksList = [savedArtworksArtworkList, ...customArtworkLists]

  const artworkSections = artworksList.map((artworkList) => {
    const isDefaultArtworkList = artworkList.internalID === savedArtworksArtworkList.internalID
    return {
      key: artworkList.internalID,
      content: (
        <ArtworkListItem
          artworkList={artworkList}
          imagesLayout={isDefaultArtworkList ? "grid" : "stacked"}
        />
      ),
    }
  })

  return (
    <StickyTabPageFlatList
      style={{ paddingTop: space(2) }}
      data={artworkSections}
      numColumns={artworkListsColCount}
      keyExtractor={(item, index) => String(item.id || index)}
    />
  )
}

export const ArtworkListsQR = () => (
  <Suspense fallback={<ArtworkListsPlaceHolder />}>
    <ArtworkLists />
  </Suspense>
)

export const ArtworkListsPlaceHolder = () => (
  <StickyTabPageScrollView
    style={{ flex: 1 }}
    contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
    scrollEnabled={false}
  >
    <Flex alignItems="center">
      <Spinner />
    </Flex>
  </StickyTabPageScrollView>
)

export const artworkListsQuery = graphql`
  query ArtworkListsQuery {
    me {
      savedArtworksArtworkList: collection(id: "saved-artwork") {
        internalID
        ...ArtworkListItem_collection
      }

      customArtworkLists: collectionsConnection(
        first: 30
        default: false
        saves: true
        sort: CREATED_AT_DESC
      ) {
        edges {
          node {
            internalID
            ...ArtworkListItem_collection
          }
        }
      }
    }
  }
`
