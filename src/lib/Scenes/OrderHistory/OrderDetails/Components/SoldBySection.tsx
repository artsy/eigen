import { SoldBySection_soldBy } from "__generated__/SoldBySection_soldBy.graphql"
import { extractNodes } from "lib/utils/extractNodes"
import { Box, Flex, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  soldBy: SoldBySection_soldBy
  testID?: string
}

export const SoldBySection: React.FC<Props> = ({ soldBy }) => {
  const fulfillments = extractNodes(soldBy.lineItems)[0].fulfillments[0]
  if (!soldBy) {
    return null
  }

  return (
    <Box flexDirection="column" justifyContent="space-between">
      <Text testID="delivery" variant="text">
        Estimated Delivery: {fulfillments.trackingId}
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
                  trackingId
                }
              }
            }
          }
        }
      }
    }
  `,
})
