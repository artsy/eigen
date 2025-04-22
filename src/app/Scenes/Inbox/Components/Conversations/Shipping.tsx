import { Flex, Text, Separator } from "@artsy/palette-mobile"
import { Shipping_order$data } from "__generated__/Shipping_order.graphql"
import { createFragmentContainer, graphql } from "react-relay"

interface ShippingProps {
  order: Shipping_order$data
}

export const Shipping: React.FC<ShippingProps> = ({ order }) => {
  const { requestedFulfillment } = order
  if (!requestedFulfillment) {
    return null
  }

  if (
    requestedFulfillment.__typename === "CommerceShip" ||
    requestedFulfillment.__typename === "CommerceShipArta"
  ) {
    const { name, addressLine1, city, country, postalCode } = requestedFulfillment
    const addressCondensed = [city, country, postalCode]
      .filter((value) => value && value !== "")
      .join(", ")

    return (
      <>
        <Flex flexDirection="column" p={2} key="support-section">
          <Text variant="sm-display" mb={1} weight="medium">
            Ship to
          </Text>

          {!!name && <Text color="mono60">{name}</Text>}
          {!!addressLine1 && <Text color="mono60">{addressLine1}</Text>}
          <Text color="mono60">{addressCondensed}</Text>
        </Flex>
        <Separator />
      </>
    )
  }

  if (!order.lineItems?.edges || !order.lineItems?.edges[0]) {
    return null
  }

  return (
    <>
      <Flex flexDirection="column" p={2} key="support-section">
        <Text variant="sm-display" mb={1} weight="medium">
          {`Pick up (${order.lineItems.edges[0].node?.artwork?.shippingOrigin})`}
        </Text>

        <Text color="mono60">
          After your order is confirmed, a specialist will contact you within 2 business days to
          coordinate pickup.
        </Text>
      </Flex>
      <Separator />
    </>
  )
}

export const ShippingFragmentContainer = createFragmentContainer(Shipping, {
  order: graphql`
    fragment Shipping_order on CommerceOrder {
      requestedFulfillment {
        __typename
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
      lineItems {
        edges {
          node {
            artwork {
              shippingOrigin
            }
          }
        }
      }
    }
  `,
})
