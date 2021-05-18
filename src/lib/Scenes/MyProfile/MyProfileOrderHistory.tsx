import { MyProfileOrderHistory_me } from "__generated__/MyProfileOrderHistory_me.graphql"
import { MyProfileOrderHistoryQuery } from "__generated__/MyProfileOrderHistoryQuery.graphql"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import colors from "lib/data/colors"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractNodes } from "lib/utils/extractNodes"
import { PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { times } from "lodash"
import { Flex, Sans, Spacer } from "palette"
import React, { useCallback, useEffect, useState } from "react"
import { FlatList, RefreshControl } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"

const NUM_ORDERS_TO_FETCH = 10

// tslint:disable-next-line:variable-name
export let __triggerRefresh: null | (() => Promise<void>) = null

const MyProfileOrderHistory: React.FC<{ me: MyProfileOrderHistory_me; relay: RelayPaginationProp }> = ({
  relay,
  me,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  // set up the global refresh hook. this one doesn't need to update the loading state
  useEffect(() => {
    const triggerRefresh = async () => {
      await new Promise((resolve) => {
        relay.refetchConnection(NUM_ORDERS_TO_FETCH, resolve)
      })
    }
    __triggerRefresh = triggerRefresh
    return () => {
      if (__triggerRefresh === triggerRefresh) {
        __triggerRefresh = null
      }
    }
  }, [])

  const onRefresh = useCallback(() => {
    setIsRefreshing(true)
    relay.refetchConnection(NUM_ORDERS_TO_FETCH, () => {
      setIsRefreshing(false)
    })
  }, [])
  const onLoadMore = useCallback(() => {
    if (!relay.hasMore() || relay.isLoading() || isLoadingMore) {
      return
    }
    setIsLoadingMore(true)
    relay.loadMore(NUM_ORDERS_TO_FETCH, () => {
      setIsLoadingMore(false)
    })
  }, [isLoadingMore, relay])

  const orders = extractNodes(me.orders)

  return (
    <PageWithSimpleHeader title="Order History">
      <FlatList
        style={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        data={orders}
        keyExtractor={(item) => item.internalID}
        contentContainerStyle={{ flexGrow: 1, paddingTop: orders.length === 0 ? 10 : 20 }}
        renderItem={({ item }) => (
          <Flex flexDirection="row" justifyContent="space-between" px={2}>
            <Sans size="4t" color="red100">
              {item.internalID}
            </Sans>
          </Flex>
        )}
        ListEmptyComponent={
          <Flex flex={1} flexDirection="column" justifyContent="center" alignItems="center" px={2}>
            <Sans size="5t" color={colors["gray-semibold"]}>
              No orders
            </Sans>
          </Flex>
        }
        onEndReachedThreshold={0.25}
        onEndReached={onLoadMore}
        ItemSeparatorComponent={() => <Spacer mb={10} />}
      />
    </PageWithSimpleHeader>
  )
}

export const MyProfileOrderHistoryPlaceholder: React.FC<{}> = () => (
  <PageWithSimpleHeader title="Order History">
    <Flex px={2} py={15}>
      {times(2).map((index: number) => (
        <Flex key={index} py={1}>
          <PlaceholderText width={100 + Math.random() * 100} />
        </Flex>
      ))}
    </Flex>
  </PageWithSimpleHeader>
)

const MyProfileOrderHistoryContainer = createPaginationContainer(
  MyProfileOrderHistory,
  {
    me: graphql`
      fragment MyProfileOrderHistory_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        name
        orders(first: $count, after: $cursor) @connection(key: "MyProfileOrderHistory_orders") {
          edges {
            node {
              internalID
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.me.orders
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        // in most cases, for variables other than connection filters like
        // `first`, `after`, etc. you may want to use the previous values.
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql`
      query MyProfileOrderHistoryPaginationQuery($count: Int!, $cursor: String) {
        me {
          ...MyProfileOrderHistory_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

export const MyProfileOrderHistoryQueryRender: React.FC<{}> = ({}) => {
  return (
    <QueryRenderer<MyProfileOrderHistoryQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MyProfileOrderHistoryQuery($count: Int!) {
          me {
            ...MyProfileOrderHistory_me @arguments(count: $count)
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: MyProfileOrderHistoryContainer,
        renderPlaceholder: () => <MyProfileOrderHistoryPlaceholder />,
      })}
      variables={{ count: NUM_ORDERS_TO_FETCH }}
      cacheConfig={{ force: true }}
    />
  )
}
