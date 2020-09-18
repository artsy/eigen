import { MyCollectionArtworkList_me } from "__generated__/MyCollectionArtworkList_me.graphql"
import { MyCollectionArtworkListQuery } from "__generated__/MyCollectionArtworkListQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { MyCollectionArtworkListHeader } from "lib/Scenes/MyCollection/Screens/ArtworkList/MyCollectionArtworkListHeader"
import { MyCollectionArtworkListItemFragmentContainer } from "lib/Scenes/MyCollection/Screens/ArtworkList/MyCollectionArtworkListItem"
import { AppStore } from "lib/store/AppStore"
import { extractNodes } from "lib/utils/extractNodes"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Separator } from "palette"
import React from "react"
import { FlatList, View } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"

interface MyCollectionArtworkListProps {
  me: MyCollectionArtworkList_me
  relay: RelayPaginationProp
}

const PAGE_SIZE = 20

export const MyCollectionArtworkList: React.FC<MyCollectionArtworkListProps> = ({ me, relay }) => {
  const { navigation: navActions } = AppStore.actions.myCollection
  const artworks = extractNodes(me?.myCollectionConnection)
  const { hasMore, isLoading, loadMore } = relay

  const fetchNextPage = () => {
    if (!hasMore() || isLoading()) {
      return
    }

    loadMore(PAGE_SIZE!, (error) => {
      if (error) {
        throw new Error(`Error fetching artworks in MyCollectionArtworkList.tsx: ${error}`)
      }
    })
  }
  return (
    <View>
      <MyCollectionArtworkListHeader id={me?.id} />
      <FlatList
        data={artworks}
        ItemSeparatorComponent={() => <Separator />}
        keyExtractor={(node) => node!.id}
        onScroll={isCloseToBottom(fetchNextPage)}
        renderItem={({ item }) => {
          return (
            <MyCollectionArtworkListItemFragmentContainer
              artwork={item}
              onPress={() => navActions.navigateToArtworkDetail(item.slug)}
            />
          )
        }}
      />
    </View>
  )
}

export const MyCollectionArtworkListContainer = createPaginationContainer(
  MyCollectionArtworkList,
  {
    me: graphql`
      fragment MyCollectionArtworkList_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, cursor: { type: "String" }) {
        id
        myCollectionConnection(first: $count, after: $cursor, sort: CREATED_AT_DESC)
        @connection(key: "MyCollectionArtworkList_myCollectionConnection", filters: []) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              slug
              ...MyCollectionArtworkListItem_artwork
            }
          }
        }
      }
    `,
  },
  {
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql`
      query MyCollectionArtworkListPaginationQuery($count: Int!, $cursor: String) {
        me {
          ...MyCollectionArtworkList_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

export const MyCollectionArtworkListQueryRenderer: React.FC = () => {
  return (
    <QueryRenderer<MyCollectionArtworkListQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MyCollectionArtworkListQuery {
          me {
            ...MyCollectionArtworkList_me
          }
        }
      `}
      variables={{}}
      render={renderWithLoadProgress(MyCollectionArtworkListContainer)}
    />
  )
}
