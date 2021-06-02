import { OrderDetails_order } from "__generated__/OrderDetails_order.graphql"
import { DateTime } from "luxon"
import { LocaleOptions } from "luxon"
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
  const { createdAt, requestedFulfillment, code } = info
  const isShip = requestedFulfillment?.__typename === "CommerceShip"
  const orderCreatedAt = DateTime.fromISO(createdAt)

  return (
    <Flex flexDirection="column" justifyContent="space-between">
      <Flex flexDirection="row">
        <Text style={{ width: 112 }} mb={10} variant="text">
          Order Date
        </Text>

        <Text mb={10} data-test-id="date" color="black60" variant="text">
          {orderCreatedAt.toLocaleString(DateTime.DATE_SHORT as LocaleOptions)}
        </Text>
      </Flex>
      <Flex flexDirection="row">
        <Text style={{ width: 112 }} mb={10} variant="text">
          Order Number
        </Text>
        <Text data-test-id="code" mb={10} color="black60" variant="text">
          {code}
        </Text>
      </Flex>
      <Flex flexDirection="row">
        <Text style={{ width: 112 }} mb={10} variant="text">
          Status
        </Text>
        <Text mb={10} data-test-id="commerceShip" color="black60" variant="text">
          {isShip ? "Delivery" : "Pickup"}
        </Text>
      </Flex>
    </Flex>
  )
}

export const OrderDetailsHeaderFragmentContainer = createFragmentContainer(OrderDetailsHeader, {
  info: graphql`
    fragment OrderDetailsHeader_info on CommerceOrder {
      createdAt
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
