import { SoldBySection_soldBy } from "__generated__/SoldBySection_soldBy.graphql"
import { extractNodes } from "lib/utils/extractNodes"
import { DateTime, LocaleOptions } from "luxon"
import { Box, Flex, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  soldBy: SoldBySection_soldBy
  testID?: string
}

export const SoldBySection: React.FC<Props> = ({ soldBy }) => {
  const fulfillmentsEdge = extractNodes(soldBy.lineItems)[0]
  const estimatedDelivery = extractNodes(fulfillmentsEdge.fulfillments)[0].estimatedDelivery
  const orderEstimatedDelivery = estimatedDelivery ? DateTime.fromISO(estimatedDelivery) : null
  if (!soldBy) {
    return null
  }

  return (
    <Box flexDirection="row" alignItems="center">
      <Text>Estimated Delivery: </Text>
      <Text testID="delivery" variant="text">
        {orderEstimatedDelivery ? orderEstimatedDelivery.toLocaleString(DateTime.DATE_SHORT as LocaleOptions) : null}
      </Text>
    </Box>
  )
}

export const SoldBySectionFragmentContainer = createFragmentContainer(SoldBySection, {
  soldBy: graphql`
    fragment SoldBySection_soldBy on CommerceOrder {
      lineItems(first: 1) {
        edges {
          node {
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
