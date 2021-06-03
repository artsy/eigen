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
  const artworkItem = extractNodes(soldBy.lineItems)[0].artwork
  if (!artworkItem) {
    return null
  }

  return (
    <Flex style={{ flexDirection: "column", justifyContent: "space-between" }}>
      <Box display="flex" flexDirection="row">
        <Text variant="text" color="black60">
          {!!artworkItem?.shippingOrigin && artworkItem?.shippingOrigin.replace(/, US/g, "")}
        </Text>
      </Box>
      <Text testID="country" variant="text">
        Estimated Delivery:
      </Text>
    </Flex>
  )
}

export const SoldBySectionFragmentContainer = createFragmentContainer(SoldBySection, {
  soldBy: graphql`
    fragment SoldBySection_soldBy on CommerceOrder {
      lineItems(first: 1) {
        edges {
          node {
            fulfillments {
              edges {
                node {
                  courier
                  trackingId
                  estimatedDelivery(format: "MMM Do, YYYY")
                }
              }
            }
            artwork {
              shippingOrigin
              partner {
                name
              }
            }
          }
        }
      }
    }
  `,
})
