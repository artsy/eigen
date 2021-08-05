import { SavedSearchesList_me } from "__generated__/SavedSearchesList_me.graphql"
import { SAVED_SERCHES_PAGE_SIZE } from "lib/data/constants"
import { navigate, navigationEvents } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { Flex, Spinner, useTheme } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { EmptyMessage } from "./EmptyMessage"
import { SavedSearchListItem } from "./SavedSearchListItem"

interface SavedSearchesListProps {
  me: SavedSearchesList_me
  relay: RelayPaginationProp
}

export const SavedSearchesList: React.FC<SavedSearchesListProps> = (props) => {
  const { me, relay } = props
  const [fetchingMore, setFetchingMore] = useState(false)
  const { space } = useTheme()
  const items = extractNodes(me.savedSearchesConnection)
  const flatListRef = useRef<FlatList>(null)
  const onRefresh = useRef(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false })
    relay.refetchConnection(SAVED_SERCHES_PAGE_SIZE, (error) => {
      if (error) {
        console.error(error)
      }
    })
  }).current

  useEffect(() => {
    navigationEvents.addListener("goBack", onRefresh)
    return () => {
      navigationEvents.removeListener("goBack", onRefresh)
    }
  }, [])

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

  if (items.length === 0) {
    return <EmptyMessage />
  }

  return (
    <FlatList
      ref={flatListRef}
      data={items}
      keyExtractor={(item) => item.internalID}
      contentContainerStyle={{ paddingVertical: space(1) }}
      renderItem={({ item }) => {
        return (
          <SavedSearchListItem
            title={item.userAlertSettings.name!}
            onPress={() => {
              navigate(`/saved-search-alerts/${item.internalID}`, { passProps: { artistID: item.artistID } })
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
        savedSearchesConnection(first: $count, after: $cursor)
          @connection(key: "SavedSearches_savedSearchesConnection") {
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            node {
              internalID
              artistID
              userAlertSettings {
                name
              }
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
      return props.me.savedSearchesConnection
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
