import { SoldBySection_soldBy } from "__generated__/SoldBySection_soldBy.graphql"
import { extractNodes } from "lib/utils/extractNodes"
import { DateTime, LocaleOptions } from "luxon"
import { Box, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  soldBy: SoldBySection_soldBy
  testID?: string
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
        <Text variant="text" color="black60">
          {isForPickup ? "Pick up " : "Ships from "}
        </Text>
        <Text testID="shippingOrigin" color="black60" variant="text">
          {isForPickup ? `(${artwork?.shippingOrigin})` : artwork?.shippingOrigin}
        </Text>
      </Box>
      {!!orderEstimatedDelivery && (
        <Box flexDirection="row">
          <Text color="black60" variant="text">
            Estimated Delivery:{" "}
          </Text>
          <Text color="black60" testID="delivery" variant="text">
            {orderEstimatedDelivery.toLocaleString(DateTime.DATE_MED as LocaleOptions)}
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
