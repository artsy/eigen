import { MyCollectionArtworkList_myCollectionConnection$key } from "__generated__/MyCollectionArtworkList_myCollectionConnection.graphql"
import { PrefetchFlatList } from "lib/Components/PrefetchFlatList"
import { extractNodes } from "lib/utils/extractNodes"
import { Flex } from "palette"
import React from "react"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { MyCollectionArtworkListItem } from "./MyCollectionArtworkListItem"

export const MyCollectionArtworkList: React.FC<{
  myCollectionConnection: MyCollectionArtworkList_myCollectionConnection$key | null
  localSortAndFilterArtworks?: (artworks: any[]) => any[]
}> = ({ localSortAndFilterArtworks, ...restProps }) => {
  const artworkConnection = useFragment<MyCollectionArtworkList_myCollectionConnection$key>(
    artworkConnectionFragment,
    restProps.myCollectionConnection
  )

  const artworks = extractNodes(artworkConnection)

  const preprocessedArtworks = localSortAndFilterArtworks?.(artworks) ?? artworks

  return (
    <Flex>
      <PrefetchFlatList
        // prefetchUrlExtractor={(item) => item?.href!}
        data={preprocessedArtworks}
        renderItem={({ item }) => <MyCollectionArtworkListItem artwork={item} />}
        keyExtractor={(item, index) => String(item.slug || index)}
      />
    </Flex>
  )
}

const artworkConnectionFragment = graphql`
  fragment MyCollectionArtworkList_myCollectionConnection on MyCollectionConnection {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        title
        slug
        id
        image {
          aspectRatio
        }
        artistNames
        medium
        artist {
          internalID
          name
        }
        pricePaid {
          minor
        }
        sizeBucket
        width
        height
        date
        ...MyCollectionArtworkListItem_artwork
      }
    }
  }
`
