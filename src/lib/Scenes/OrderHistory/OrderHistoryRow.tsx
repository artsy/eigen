import { OrderHistoryRow_order } from "__generated__/OrderHistoryRow_order.graphql"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import moment from "moment"
import { Box, Button, Flex, Spacer, Text } from "palette"
import React from "react"
import { Image } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface OrderHistoryRowProps {
  order: OrderHistoryRow_order
}

const OrderHistoryRow: React.FC<OrderHistoryRowProps> = ({ order }) => {
  const [{ artwork }] = extractNodes(order?.lineItems)

  return (
    <Box>
      <Flex>
        <Flex flexDirection="row" justifyContent="space-between">
          <Box flexGrow={1}>
            {!!artwork.image ? (
              <Image source={{ uri: artwork?.image?.resized?.url }} style={{ height: 50, width: 50 }} />
            ) : (
              <Box width="50px" height="50px" backgroundColor="black10" />
            )}
          </Box>
          <Box flexGrow={3}>
            <Text fontSize={16} fontWeight={500} lineHeight={22}>
              {artwork?.artistNames}
            </Text>
            <Text fontSize={14} fontWeight={400} lineHeight={21} color="black60">
              {artwork?.partner?.name}
            </Text>
            <Text fontSize={14} fontWeight={400} lineHeight={21} color="black60">
              {moment(order.createdAt).format("l")}
            </Text>
          </Box>
          <Box flexGrow={1}>
            <Flex justifyContent="flex-end">
              <Text textAlign="right" fontSize={15} fontWeight={400} lineHeight={22.5}>
                {order.buyerTotal}
              </Text>
              <Text
                textAlign="right"
                fontSize={14}
                fontWeight={400}
                lineHeight={21}
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
