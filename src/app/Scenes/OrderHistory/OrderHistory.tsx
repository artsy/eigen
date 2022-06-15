import { OrderHistory_me$data } from "__generated__/OrderHistory_me.graphql"
import { OrderHistoryQuery } from "__generated__/OrderHistoryQuery.graphql"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { PlaceholderBox, PlaceholderButton, PlaceholderText } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { times } from "lodash"
import { Box, Flex, Sans, Separator, useTheme } from "palette"
import React, { useCallback, useState } from "react"
import { FlatList, RefreshControl } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { OrderHistoryRowContainer } from "./OrderHistoryRow"

const NUM_ORDERS_TO_FETCH = 10

export const OrderHistory: React.FC<{ me: OrderHistory_me$data; relay: RelayPaginationProp }> = ({
  relay,
  me,
}) => {
  const { color } = useTheme()
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
          <Flex flexDirection="row" justifyContent="space-between" px={15}>
            <OrderHistoryRowContainer order={item} key={item.code} />
          </Flex>
        )}
        ListEmptyComponent={
          <Flex flex={1} flexDirection="column" justifyContent="center" alignItems="center" px={15}>
            <Sans size="5t" color={color("black60")}>
              No orders
            </Sans>
          </Flex>
        }
        onEndReachedThreshold={0.25}
        onEndReached={onLoadMore}
        ItemSeparatorComponent={() => (
          <Flex flexDirection="column" justifyContent="center" alignItems="center" px={15}>
            <Separator mt={10} mb={20} />
          </Flex>
        )}
      />
    </PageWithSimpleHeader>
  )
}

export const OrderHistoryPlaceholder: React.FC<{}> = () => (
  <PageWithSimpleHeader title="Order History">
    <Flex px={15} mt={15}>
      {times(2).map((index: number) => (
        <Box key={index}>
          <Flex mt={10}>
            <Flex flexDirection="row" justifyContent="space-between">
              <Box flexGrow={1}>
                <PlaceholderBox height={50} width={50} />
              </Box>
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
          <PlaceholderButton marginTop={10} />
          <Flex flexDirection="column" justifyContent="center" alignItems="center" mt={10}>
            <Separator mt={10} mb={20} />
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
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
        states: {
          type: "[CommerceOrderStateEnum!]"
          defaultValue: [APPROVED, CANCELED, FULFILLED, REFUNDED, SUBMITTED]
        }
      ) {
        orders(first: $count, after: $cursor, states: $states)
          @connection(key: "OrderHistory_orders") {
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
      query OrderHistoryPaginationQuery(
        $count: Int!
        $cursor: String
        $states: [CommerceOrderStateEnum!]
      ) {
        me {
          ...OrderHistory_me @arguments(count: $count, cursor: $cursor, states: $states)
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
          me @optionalField {
            name
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
