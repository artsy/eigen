import { Flex, Spacer, Spinner } from "@artsy/palette-mobile"
import { MyCollectionCollectedArtistsOnlyView_me$key } from "__generated__/MyCollectionCollectedArtistsOnlyView_me.graphql"
import { StickTabPageRefreshControl } from "app/Components/StickyTabPage/StickTabPageRefreshControl"
import { MyCollectionCollectedArtistItem } from "app/Scenes/MyCollection/Components/MyCollectionCollectedArtistItem"
import { extractNodes } from "app/utils/extractNodes"
import { useState } from "react"
import { FlatList } from "react-native"
import { graphql, usePaginationFragment } from "react-relay"

interface MyCollectionCollectedArtistsOnlyViewProps {
  me: MyCollectionCollectedArtistsOnlyView_me$key
}

export const MyCollectionCollectedArtistsOnlyView: React.FC<
  MyCollectionCollectedArtistsOnlyViewProps
> = ({ me }) => {
  const [refreshing, setRefreshing] = useState(false)
  const { data, hasNext, loadNext, isLoadingNext, refetch } = usePaginationFragment(
    collectedArtistsPaginationFragment,
    me
  )

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(10)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    refetch(
      {},
      {
        fetchPolicy: "store-and-network",
        onComplete: () => {
          setRefreshing(false)
        },
      }
    )
  }

  const collectedArtists = extractNodes(data.myCollectionInfo?.collectedArtistsConnection)

  if (!collectedArtists.length) {
    return null
  }

  return (
    <FlatList
      data={collectedArtists}
      renderItem={({ item: artist }) => {
        return <MyCollectionCollectedArtistItem artist={artist} key={artist.internalID} />
      }}
      onEndReached={handleLoadMore}
      ListFooterComponent={!!hasNext ? <LoadingIndicator /> : <Spacer y={2} />}
      ItemSeparatorComponent={() => <Spacer y={2} />}
      refreshControl={
        <StickTabPageRefreshControl onRefresh={handleRefresh} refreshing={refreshing} />
      }
    />
  )
}

const LoadingIndicator = () => {
  return (
    <Flex alignItems="center" justifyContent="center" py={4}>
      <Spinner />
    </Flex>
  )
}

const collectedArtistsPaginationFragment = graphql`
  fragment MyCollectionCollectedArtistsOnlyView_me on Me
  @argumentDefinitions(count: { type: "Int", defaultValue: 5 }, after: { type: "String" })
  @refetchable(queryName: "MyCollectionCollectedArtistsOnlyView_myCollectionInfoRefetch") {
    myCollectionInfo {
      collectedArtistsConnection(first: $count, after: $after)
        @connection(key: "MyCollectionCollectedArtistsOnlyView_collectedArtistsConnection") {
        edges {
          node {
            internalID
            ...MyCollectionCollectedArtistItem_artist
          }
        }
      }
    }
  }
`

// export const MyCollectionCollectedArtistsOnlyViewPaginationContainer = createPaginationContainer(
//   MyCollectionCollectedArtistsOnlyView,
//   {
//     myCollectionInfo: graphql`
//       fragment MyCollectionCollectedArtistsOnlyView_myCollectionInfo on MyCollectionInfo
//       @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, cursor: { type: "String" }) {
//         collectedArtistsConnection(first: $count, after: $cursor, includePersonalArtists: true)
//           @connection(key: "MyCollectionCollectedArtistsOnlyView_collectedArtistsConnection") {
//           edges {
//             node {
//               internalID
//               ...MyCollectionCollectedArtistItem_artist
//             }
//           }
//         }
//       }
//     `,
//   },
//   {
//     getConnectionFromProps(props) {
//       return props?.myCollectionInfo?.collectedArtistsConnection
//     },
//     getFragmentVariables(prevVars, totalCount) {
//       return {
//         ...prevVars,
//         count: totalCount,
//       }
//     },
//     getVariables(_props, { count, cursor }, fragmentVariables) {
//       return {
//         ...fragmentVariables,
//         cursor,
//         count,
//       }
//     },
//     query: graphql`
//       query MyCollectionCollectedArtistsOnlyViewQuery($cursor: String, $count: Int!) {
//         me {
//           myCollectionInfo {
//             ...MyCollectionCollectedArtistsOnlyView_myCollectionInfo
//               @arguments(cursor: $cursor, count: $count)
//           }
//         }
//       }
//     `,
//   }
// )
