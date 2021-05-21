import { OrderHistory_me } from "__generated__/OrderHistory_me.graphql"
import { OrderHistoryQuery } from "__generated__/OrderHistoryQuery.graphql"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import colors from "lib/data/colors"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractNodes } from "lib/utils/extractNodes"
import { PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { times } from "lodash"
import { Flex, Sans, Spacer } from "palette"
import React, { useCallback, useState } from "react"
import { FlatList, RefreshControl } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"

const NUM_ORDERS_TO_FETCH = 10

export const OrderHistory: React.FC<{ me: OrderHistory_me; relay: RelayPaginationProp }> = ({ relay, me }) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

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

export const OrderHistoryPlaceholder: React.FC<{}> = () => (
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

export const OrderHistoryContainer = createPaginationContainer(
  OrderHistory,
  {
    me: graphql`
      fragment OrderHistory_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        orders(first: $count, after: $cursor) @connection(key: "OrderHistory_orders") {
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
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql`
      query OrderHistoryPaginationQuery($count: Int!, $cursor: String) {
        me {
          ...OrderHistory_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

export const OrderHistoryQueryRender: React.FC<{}> = ({}) => {
  return (
    <QueryRenderer<OrderHistoryQuery>
      environment={defaultEnvironment}
      query={graphql`
        query OrderHistoryQuery($count: Int!) {
          me {
            ...OrderHistory_me @arguments(count: $count)
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: OrderHistoryContainer,
        renderPlaceholder: () => <OrderHistoryPlaceholder />,
      })}
      variables={{ count: NUM_ORDERS_TO_FETCH }}
      cacheConfig={{ force: true }}
    />
  )
}
