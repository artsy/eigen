import { SavedSearchesList_me } from "__generated__/SavedSearchesList_me.graphql"
import { SAVED_SERCHES_PAGE_SIZE } from "lib/data/constants"
import { extractNodes } from "lib/utils/extractNodes"
import { Flex, Spinner, useTheme } from "palette"
import React from "react"
import { useState } from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { SavedSearchListItem } from "./SavedSearchListItem"

interface SavedSearchesListProps {
  me: SavedSearchesList_me
  relay: RelayPaginationProp
}

export const SavedSearchesList: React.FC<SavedSearchesListProps> = (props) => {
  const { me, relay } = props
  const [fetchingMore, setFetchingMore] = useState(false)
  const { space } = useTheme()
  const items = extractNodes(me.recentlyViewedArtworksConnection)

  const loadMore = () => {
    if (!relay.hasMore() || relay.isLoading()) {
      return
    }
    setFetchingMore(true)
    relay.loadMore(SAVED_SERCHES_PAGE_SIZE, (error) => {
      if (error) {
        console.log(error.message)
      }
      setFetchingMore(false)
    })
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingVertical: space(1) }}
      renderItem={({ item }) => {
        return (
          <SavedSearchListItem
            title={item.slug}
            onPress={() => {
              console.log("pressed")
            }}
          />
        )
      }}
      onEndReached={loadMore}
      ListFooterComponent={
        fetchingMore ? (
          <Flex alignItems="center" mt={2} mb={4}>
            <Spinner />
          </Flex>
        ) : null
      }
    />
  )
}

export const SavedSearchesListContainer = createPaginationContainer(
  SavedSearchesList,
  {
    me: graphql`
      fragment SavedSearchesList_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, cursor: { type: "String" }) {
        recentlyViewedArtworksConnection(first: $count, after: $cursor)
          @connection(key: "SavedSearches_recentlyViewedArtworksConnection") {
          edges {
            node {
              id
              slug
            }
          }
        }
      }
    `,
  },
  {
    getVariables(_props, { count, cursor }) {
      return {
        count,
        cursor,
      }
    },
    getConnectionFromProps(props) {
      return props.me.recentlyViewedArtworksConnection
    },
    query: graphql`
      query SavedSearchesListQuery($count: Int!, $cursor: String) {
        me {
          ...SavedSearchesList_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
