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
  const { fulfillments, artwork } = extractNodes(soldBy.lineItems)[0]
  const estimatedDelivery = extractNodes(fulfillments)[0].estimatedDelivery
  const orderEstimatedDelivery = estimatedDelivery ? DateTime.fromISO(estimatedDelivery) : null
  if (!soldBy) {
    return null
  }

  return (
    <Box>
      <Box flexDirection="row">
        <Text variant="text" color="black60">
          Ships from{" "}
        </Text>
        <Text testID="shippingOrigin" color="black60" variant="text">
          {artwork?.shippingOrigin}
        </Text>
      </Box>
      <Box flexDirection="row">
        <Text variant="text">Estimated Delivery: </Text>
        <Text testID="delivery" variant="text">
          {orderEstimatedDelivery ? orderEstimatedDelivery.toLocaleString(DateTime.DATE_SHORT as LocaleOptions) : null}
        </Text>
      </Box>
    </Box>
  )
}

export const SoldBySectionFragmentContainer = createFragmentContainer(SoldBySection, {
  soldBy: graphql`
    fragment SoldBySection_soldBy on CommerceOrder {
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
