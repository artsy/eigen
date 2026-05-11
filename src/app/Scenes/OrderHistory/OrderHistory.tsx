import { OwnerType } from "@artsy/cohesion"
import { Box, Flex, Separator, Text, useTheme } from "@artsy/palette-mobile"
import { OrderHistoryQuery } from "__generated__/OrderHistoryQuery.graphql"
import { OrderHistory_me$data } from "__generated__/OrderHistory_me.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { PlaceholderBox, PlaceholderButton, PlaceholderText } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { times } from "lodash"
import React, { useCallback, useState } from "react"
import { FlatList, RefreshControl } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { OrderHistoryRowContainer } from "./OrderHistoryRow"

const NUM_ORDERS_TO_FETCH = 10

export const OrderHistory: React.FC<{ me: OrderHistory_me$data; relay: RelayPaginationProp }> = ({
  relay,
  me,
}) => {
  const { color, space } = useTheme()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const onRefresh = useCallback(() => {
    setIsRefreshing(true)
    relay.refetchConnection(NUM_ORDERS_TO_FETCH, () => {
      setIsRefreshing(false)
    })
  }, [relay])
  const onLoadMore = useCallback(() => {
    if (!relay.hasMore() || relay.isLoading() || isLoadingMore) {
      return
    }
    setIsLoadingMore(true)
    relay.loadMore(NUM_ORDERS_TO_FETCH, () => {
      setIsLoadingMore(false)
    })
  }, [isLoadingMore, relay])

  const orders = extractNodes(me.ordersConnection)

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.accountOrders,
      })}
    >
      <FlatList
        style={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        data={orders}
        keyExtractor={(order) => order.internalID}
        contentContainerStyle={{ flexGrow: 1, paddingTop: space(2) }}
        renderItem={({ item }) => (
          <Flex flexDirection="row" justifyContent="space-between" px="15px">
            <OrderHistoryRowContainer order={item} key={item.internalID} />
          </Flex>
        )}
        ListEmptyComponent={
          <Flex
            flex={1}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            px="15px"
          >
            <Text variant="sm-display" color={color("mono60")}>
              No orders
            </Text>
          </Flex>
        }
        onEndReachedThreshold={0.25}
        onEndReached={onLoadMore}
        ItemSeparatorComponent={() => (
          <Flex flexDirection="column" justifyContent="center" alignItems="center" px="15px">
            <Separator mt={10} mb={20} />
          </Flex>
        )}
      />
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

export const OrderHistoryPlaceholder: React.FC<{}> = () => (
  <Flex px="15px" mt="15px">
    {times(2).map((index: number) => (
      <Box key={index}>
        <Flex mt={1}>
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
        <Flex flexDirection="column" justifyContent="center" alignItems="center" mt={1}>
          <Separator mt={10} mb={20} />
        </Flex>
      </Box>
    ))}
  </Flex>
)

export const OrderHistoryContainer = createPaginationContainer(
  OrderHistory,
  {
    me: graphql`
      fragment OrderHistory_me on Me
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
        buyerState: {
          type: "[OrderBuyerStateEnum]"
          defaultValue: [
            SUBMITTED
            OFFER_RECEIVED
            COUNTEROFFER_SENT
            PAYMENT_FAILED
            PROCESSING_PAYMENT
            PROCESSING_OFFLINE_PAYMENT
            APPROVED
            SHIPPED
            COMPLETED
            CANCELED
            REFUNDED
            DECLINED_BY_SELLER
            DECLINED_BY_BUYER
          ]
        }
      ) {
        ordersConnection(first: $count, after: $cursor, buyerState: $buyerState)
          @connection(key: "OrderHistory_ordersConnection") {
          edges {
            node {
              internalID
              ...OrderHistoryRow_order
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.me.ordersConnection
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
        $buyerState: [OrderBuyerStateEnum]
      ) {
        me {
          ...OrderHistory_me @arguments(count: $count, cursor: $cursor, buyerState: $buyerState)
        }
      }
    `,
  }
)

export const OrderHistoryQueryRender: React.FC<{}> = ({}) => {
  return (
    <QueryRenderer<OrderHistoryQuery>
      environment={getRelayEnvironment()}
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
