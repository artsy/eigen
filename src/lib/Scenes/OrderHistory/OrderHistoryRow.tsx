import { OrderHistoryRow_order } from "__generated__/OrderHistoryRow_order.graphql"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import moment from "moment"
import { Box, Button, Flex, Text } from "palette"
import React from "react"
import { Image } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface OrderHistoryRowProps {
  order: OrderHistoryRow_order
}

export const OrderHistoryRow: React.FC<OrderHistoryRowProps> = ({ order }) => {
  const [{ artwork }] = extractNodes(order?.lineItems)

  return (
    <Box>
      <Flex mb={10}>
        <Flex flexDirection="row" justifyContent="space-between">
          <Flex flexGrow={1} justifyContent="center" data-test-id="image-container">
            {!!artwork.image ? (
              <Image
                source={{ uri: artwork?.image?.resized?.url }}
                style={{ height: 50, width: 50 }}
                data-test-id="image"
              />
            ) : (
              <Box width={50} height={50} backgroundColor="black10" data-test-id="image-box" />
            )}
          </Flex>
          <Box flexGrow={3}>
            <Text variant="mediumText" data-test-id="artist-names">
              {artwork?.artistNames}
            </Text>
            <Text variant="caption" color="black60" data-test-id="partner-name">
              {artwork?.partner?.name}
            </Text>
            <Text variant="caption" color="black60" data-test-id="date">
              {moment(order.createdAt).format("l")}
            </Text>
          </Box>
          <Box flexGrow={1}>
            <Flex justifyContent="flex-end">
              <Text textAlign="right" variant="text" data-test-id="price">
                {order.buyerTotal}
              </Text>
              <Text
                textAlign="right"
                variant="caption"
                color="black60"
                style={{ textTransform: "capitalize" }}
                data-test-id="order-status"
              >
                {order.state.toLowerCase()}
              </Text>
            </Flex>
          </Box>
        </Flex>
      </Flex>
      <Button
        mb={10}
        block
        variant="secondaryGray"
        onPress={() => navigate(`/order-history/${order.internalID}`)}
        data-test-id="view-order"
      >
        View Order
      </Button>
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
      lineItems(first: 1) {
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
              artistNames
            }
          }
        }
      }
    }
  `,
})
