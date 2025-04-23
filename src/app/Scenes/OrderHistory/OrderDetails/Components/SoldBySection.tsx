import { Box, Text } from "@artsy/palette-mobile"
import { SoldBySection_soldBy$data } from "__generated__/SoldBySection_soldBy.graphql"
import { extractNodes } from "app/utils/extractNodes"
import { DateTime } from "luxon"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  soldBy: SoldBySection_soldBy$data
}

export const SoldBySection: React.FC<Props> = ({ soldBy }) => {
  if (!soldBy || !soldBy.lineItems || !soldBy.lineItems.edges?.length) {
    return null
  }
  const { fulfillments, artwork } = extractNodes(soldBy.lineItems)[0]
  const estimatedDelivery = extractNodes(fulfillments)?.[0]?.estimatedDelivery
  const orderEstimatedDelivery = estimatedDelivery ? DateTime.fromISO(estimatedDelivery) : null
  const isForPickup = soldBy?.requestedFulfillment?.__typename === "CommercePickup"

  return (
    <Box>
      <Box flexDirection="row" testID="soldByInfo">
        <Text variant="sm" color="mono60">
          {isForPickup ? "Pick up " : "Ships from "}
        </Text>
        <Text testID="shippingOrigin" color="mono60" variant="sm">
          {isForPickup ? `(${artwork?.shippingOrigin})` : artwork?.shippingOrigin}
        </Text>
      </Box>
      {!!orderEstimatedDelivery && (
        <Box flexDirection="row">
          <Text color="mono60" variant="sm">
            Estimated Delivery:{" "}
          </Text>
          <Text color="mono60" testID="delivery" variant="sm">
            {orderEstimatedDelivery.toLocaleString(DateTime.DATE_MED)}
          </Text>
        </Box>
      )}
    </Box>
  )
}

export const SoldBySectionFragmentContainer = createFragmentContainer(SoldBySection, {
  soldBy: graphql`
    fragment SoldBySection_soldBy on CommerceOrder {
      requestedFulfillment {
        ... on CommercePickup {
          __typename
        }
      }
      lineItems(first: 1) {
        edges {
          node {
            artwork {
              shippingOrigin
            }
            fulfillments(first: 1) {
              edges {
                node {
                  estimatedDelivery
                }
              }
            }
          }
        }
      }
    }
  `,
})
