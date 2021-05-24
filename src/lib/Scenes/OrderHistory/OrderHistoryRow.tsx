import { OrderHistoryRow_order } from "__generated__/OrderHistoryRow_order.graphql"
import { navigate } from "lib/navigation/navigate"
import moment from "moment"
import { Box, Button, Flex, Sans, Spacer, Text } from "palette"
import React from "react"
import { Image } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface OrderHistoryRowProps {
  order: OrderHistoryRow_order
}

const OrderHistoryRow: React.FC<OrderHistoryRowProps> = (props) => {
  const { order } = props
  // @ts-expect-error STRICT_NULL_CHECK
  const artwork = order.lineItems.edges[0].node.artwork

  return (
    <Box>
      <Flex>
        <Flex flexDirection="row" justifyContent="space-between">
          <Box flexGrow={1}>
            <Image source={{ uri: artwork?.image?.resized?.url }} style={{ height: 50, width: 50 }} />
          </Box>
          <Box flexGrow={3}>
            <Sans size="3t" weight="medium">
              {artwork?.artist_names}
            </Sans>
            <Text color="black60">{artwork?.partner?.name}</Text>
            <Text color="black60">{moment(order.createdAt).format("l")}</Text>
          </Box>
          <Box flexGrow={1}>
            <Flex justifyContent="flex-end">
              <Sans textAlign="right" size="3t" weight="medium">
                {order.buyerTotal}
              </Sans>
              <Text
                textAlign="right"
                variant="text"
                letterSpacing="tight"
                color="black60"
                style={{ textTransform: "capitalize" }}
              >
                {order.state.toLowerCase()}
              </Text>
            </Flex>
          </Box>
        </Flex>
      </Flex>
      <Spacer mb={10} />
      <Button block variant="secondaryGray" onPress={() => navigate(`/orders/${order.internalID}`)}>
        View Order
      </Button>
      <Spacer mb={10} />
    </Box>
  )
}

export const OrderHistoryRowContainer = createFragmentContainer(OrderHistoryRow, {
  order: graphql`
    fragment OrderHistoryRow_order on CommerceOrder {
      internalID
      state
      buyerTotal
      createdAt
      itemsTotal
      lineItems {
        edges {
          node {
            artwork {
              image {
                resized(width: 55) {
                  url
                }
              }
              partner {
                name
              }
              title
              artist_names: artistNames
            }
          }
        }
      }
    }
  `,
})
