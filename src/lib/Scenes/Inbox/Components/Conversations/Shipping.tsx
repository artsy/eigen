import { Shipping_order } from "__generated__/Shipping_order.graphql"
import { track as _track } from "lib/utils/track"
import { Flex, Separator, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface ShippingProps {
  order: Shipping_order
}

export const Shipping: React.FC<ShippingProps> = ({ order }) => {
  if (!order.requestedFulfillment) {
    return null
  }

  const { name, addressLine1, city, country, postalCode } = order.requestedFulfillment
  const addressCondensed = [city, country, postalCode].filter((value) => value && value !== "").join(", ")

  return (
    <>
      <Flex flexDirection="column" p={2} key="support-section">
        <Text variant="md" mb={1} weight="medium">
          Ship to
        </Text>

        {!!name && <Text color="black60">{name}</Text>}
        {!!addressLine1 && <Text color="black60">{addressLine1}</Text>}
        <Text color="black60">{addressCondensed}</Text>
      </Flex>
      <Separator />
    </>
  )
}

export const ShippingFragmentContainer = createFragmentContainer(Shipping, {
  order: graphql`
    fragment Shipping_order on CommerceOrder {
      requestedFulfillment {
        ... on CommerceShip {
          name
          addressLine1
          city
          country
          postalCode
        }
        ... on CommerceShipArta {
          name
          addressLine1
          city
          country
          postalCode
        }
      }
    }
  `,
})
