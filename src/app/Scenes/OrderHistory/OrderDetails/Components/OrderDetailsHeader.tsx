import { OrderDetailsHeader_info$data } from "__generated__/OrderDetailsHeader_info.graphql"
import { extractNodes } from "app/utils/extractNodes"
import { getOrderStatus, OrderState } from "app/utils/getOrderStatus"
import { DateTime } from "luxon"
import { Flex, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  info: OrderDetailsHeader_info$data
}

export const OrderDetailsHeader: React.FC<Props> = ({ info }) => {
  if (!info) {
    return null
  }

  const [lineItem] = extractNodes(info?.lineItems)
  const { createdAt, requestedFulfillment, code, state } = info
  const orderStatus = getOrderStatus(state as OrderState, lineItem)
  const isPickupOrder = requestedFulfillment?.__typename === "CommercePickup"

  return (
    <Flex flexDirection="row">
      <Flex flexDirection="column" mr={2}>
        <Text style={{ width: 112 }} variant="sm" mb={1}>
          Order Date
        </Text>
        <Text style={{ width: 112 }} variant="sm" mb={1}>
          Order Number
        </Text>
        <Text style={{ width: 112 }} variant="sm" mb={1}>
          Status
        </Text>
        <Text style={{ width: 112 }} variant="sm">
          Fulfillment
        </Text>
      </Flex>
      <Flex flexDirection="column">
        <Text testID="date" color="black60" variant="sm" mb={1}>
          {DateTime.fromISO(createdAt).toLocaleString(DateTime.DATE_MED)}
        </Text>
        <Text testID="code" color="black60" variant="sm" mb={1}>
          {code}
        </Text>
        <Text
          testID="status"
          color="black60"
          variant="sm"
          mb={1}
          style={{ textTransform: "capitalize" }}
        >
          {orderStatus}
        </Text>
        <Text testID="fulfillment" color="black60" variant="sm">
          {!isPickupOrder ? "Delivery" : "Pickup"}
        </Text>
      </Flex>
    </Flex>
  )
}

export const OrderDetailsHeaderFragmentContainer = createFragmentContainer(OrderDetailsHeader, {
  info: graphql`
    fragment OrderDetailsHeader_info on CommerceOrder {
      createdAt
      code
      state
      requestedFulfillment {
        ... on CommerceShip {
          __typename
        }
        ... on CommercePickup {
          __typename
        }
        ... on CommerceShipArta {
          __typename
        }
      }
      lineItems(first: 1) {
        edges {
          node {
            shipment {
              status
            }
          }
        }
      }
    }
  `,
})
