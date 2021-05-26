import { OrderHistory_me } from "__generated__/OrderHistory_me.graphql"
import { OrderHistoryQuery } from "__generated__/OrderHistoryQuery.graphql"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import colors from "lib/data/colors"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractNodes } from "lib/utils/extractNodes"
import { PlaceholderBox, PlaceholderButton, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { times } from "lodash"
import { Box, Flex, Sans, Separator, Spacer, Text } from "palette"
import React, { useCallback, useState } from "react"
import { FlatList, RefreshControl } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { ArtworkInfoSection } from "./OrderDetails/ArtworkInfoSection"
import { OrderHistoryRowContainer } from "./OrderHistoryRow"
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
        keyExtractor={(order) => order.code}
        contentContainerStyle={{ flexGrow: 1, paddingTop: orders.length === 0 ? 10 : 20 }}
        renderItem={({ item }) => (
          <Flex flexDirection="column" justifyContent="space-between" px={2}>
            <OrderHistoryRowContainer order={item} key={item.code} />
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
        ItemSeparatorComponent={() => (
          <Flex flexDirection="column" justifyContent="center" alignItems="center">
            <Separator mt={10} mb={20} width="90%" />
          </Flex>
        )}
      />
    </PageWithSimpleHeader>
  )
}

export const OrderHistoryPlaceholder: React.FC<{}> = () => (
  <PageWithSimpleHeader title="Order History">
    <Flex px={2} py={15}>
      {times(2).map((index: number) => (
        <Box key={index}>
          <Flex>
            <Flex flexDirection="row" justifyContent="space-between">
              <PlaceholderBox height={50} width={50} flexGrow={1} marginRight={10} />
              <Box flexGrow={3}>
                <PlaceholderText width={50 + Math.random() * 100} />
                <PlaceholderText width={50 + Math.random() * 100} />
                <PlaceholderText width={50 + Math.random() * 100} />
              </Box>
              <Box flexGrow={1}>
                <Flex alignItems="flex-end">
                  <PlaceholderText width={50} />
                  <PlaceholderText width={70} />
                </Flex>
              </Box>
            </Flex>
          </Flex>
          <Spacer mb={10} />
          <PlaceholderButton />
          <Spacer mb={10} />
          <Flex flexDirection="column" justifyContent="center" alignItems="center">
            <Separator mt={10} mb={20} width="90%" />
          </Flex>
        </Box>
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
              code
              ...OrderHistoryRow_order
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
