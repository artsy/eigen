import { Flex, Text } from "@artsy/palette-mobile"
import { OrderDetailsHeader_info$data } from "__generated__/OrderDetailsHeader_info.graphql"
import { getOrderStatus } from "app/utils/getOrderStatus"
import { DateTime } from "luxon"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  info: OrderDetailsHeader_info$data
}

export const OrderDetailsHeader: React.FC<Props> = ({ info }) => {
  if (!info) {
    return null
  }

  const { createdAt, requestedFulfillment, code, displayState } = info
  const orderStatus = getOrderStatus(displayState)
  const isPickupOrder = requestedFulfillment?.__typename === "CommercePickup"

  return (
    <Flex>
      <Flex flexDirection="row" justifyContent="space-between">
        <Text variant="sm" mb={1}>
          Order Date
        </Text>

        <Text testID="date" color="mono60" variant="sm" mb={1}>
          {DateTime.fromISO(createdAt).toLocaleString(DateTime.DATE_MED)}
        </Text>
      </Flex>

      <Flex flexDirection="row" justifyContent="space-between">
        <Text variant="sm" mb={1}>
          Order Number
        </Text>

        <Text testID="code" color="mono60" variant="sm" mb={1}>
          {code}
        </Text>
      </Flex>

      {!!orderStatus && (
        <Flex flexDirection="row" justifyContent="space-between">
          <Text variant="sm" mb={1}>
            Status
          </Text>

          <Text
            testID="status"
            color="mono60"
            variant="sm"
            mb={1}
            style={{ textTransform: "capitalize" }}
          >
            {orderStatus}
          </Text>
        </Flex>
      )}

      <Flex flexDirection="row" justifyContent="space-between">
        <Text variant="sm" mb={1}>
          Fulfillment
        </Text>

        <Text testID="fulfillment" color="mono60" variant="sm">
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
      displayState
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
    }
  `,
})
