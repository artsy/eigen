import { OrderDetails_order } from "__generated__/OrderDetails_order.graphql"
import moment from "moment"
import { Flex, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  info: OrderDetails_order
}

export const OrderDetailsHeader: React.FC<Props> = ({ info }) => {
  if (!info) {
    return null
  }
  const { createdAt, requestedFulfillment, code, state } = info
  const isShippedOrder = requestedFulfillment?.__typename === "CommerceShip"

  return (
    <Flex flexDirection="row">
      <Flex flexDirection="column" mr={2}>
        <Text style={{ width: 112 }} variant="text" mb={1}>
          Order Date
        </Text>
        <Text style={{ width: 112 }} variant="text" mb={1}>
          Order Number
        </Text>
        <Text style={{ width: 112 }} variant="text" mb={1}>
          Status
        </Text>
        <Text style={{ width: 112 }} variant="text">
          Fulfillment
        </Text>
      </Flex>
      <Flex flexDirection="column">
        <Text testID="date" color="black60" variant="text" mb={1}>
          {moment(createdAt).format("ll")}
        </Text>
        <Text testID="code" color="black60" variant="text" mb={1}>
          {code}
        </Text>
        <Text testID="status" color="black60" variant="text" mb={1} style={{ textTransform: "capitalize" }}>
          {state.toLowerCase()}
        </Text>
        <Text testID="commerceShip" color="black60" variant="text">
          {isShippedOrder ? "Delivery" : "Pickup"}
        </Text>
      </Flex>
    </Flex>
  )
}

export const OrderDetailsHeaderFragmentContainer = createFragmentContainer(OrderDetailsHeader, {
  info: graphql`
    fragment OrderDetailsHeader_info on CommerceOrder {
      createdAt
      state
      requestedFulfillment {
        ... on CommerceShip {
          __typename
        }
        ... on CommercePickup {
          __typename
        }
      }
      code
    }
  `,
})
