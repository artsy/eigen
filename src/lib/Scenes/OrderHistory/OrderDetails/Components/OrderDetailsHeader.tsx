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
  const isShippedOrder = requestedFulfillment?.__typename === "CommerceShip"
  const orderCreatedAt = DateTime.fromISO(createdAt)

  return (
    <Flex flexDirection="column" justifyContent="space-between">
      <Flex mb={10} flexDirection="row">
        <Text style={{ width: 112 }} variant="text">
          Order Date
        </Text>
        <Text testID="date" color="black60" variant="text">
          {orderCreatedAt.toLocaleString(DateTime.DATE_MED as LocaleOptions)}
        </Text>
      </Flex>
      <Flex mb={10} flexDirection="row">
        <Text style={{ width: 112 }} variant="text">
          Order Number
        </Text>
        <Text testID="code" color="black60" variant="text">
          {code}
        </Text>
      </Flex>
      <Flex flexDirection="row">
        <Text style={{ width: 112 }} variant="text">
          Status
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
