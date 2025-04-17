import { Spacer, Flex, Text, Separator, Join } from "@artsy/palette-mobile"
import { OrderInformation_artwork$data } from "__generated__/OrderInformation_artwork.graphql"
import { OrderInformation_order$data } from "__generated__/OrderInformation_order.graphql"
import { createFragmentContainer, graphql } from "react-relay"

interface OrderInformationProps {
  artwork: OrderInformation_artwork$data
  order: OrderInformation_order$data
}

export const OrderInformation: React.FC<OrderInformationProps> = ({ artwork, order }) => {
  if (!order || !artwork) {
    return null
  }

  return (
    <>
      <Flex flexDirection="column" p={2} key="support-section">
        <Join separator={<Spacer y={0.5} />}>
          <Text variant="sm-display" weight="medium" mb={0.5}>
            {`Order No. ${order.code}`}
          </Text>

          <>
            <Flex justifyContent="space-between" flexDirection="row">
              <Text color="mono60">
                {order.lastOffer?.fromParticipant === "SELLER" ? "Seller's offer" : "Your offer"}
              </Text>
              <Text color="mono60">{order.lastOffer?.amount}</Text>
            </Flex>

            <Flex justifyContent="space-between" flexDirection="row">
              <Text variant="xs" color="mono60">
                List price
              </Text>
              <Text variant="xs" color="mono60">
                {artwork.listPrice?.display}
              </Text>
            </Flex>
          </>

          <Flex justifyContent="space-between" flexDirection="row">
            <Text color="mono60">Shipping</Text>
            <Text color="mono60">{order.shippingTotal ?? "—"}</Text>
          </Flex>

          <Flex justifyContent="space-between" flexDirection="row">
            <Text color="mono60">Tax</Text>
            <Text color="mono60">{order.taxTotal ?? "—"}</Text>
          </Flex>

          <Flex justifyContent="space-between" flexDirection="row">
            <Text weight="medium">Total</Text>
            <Text weight="medium">{order.buyerTotal ?? ""}</Text>
          </Flex>
        </Join>
      </Flex>
      <Separator />
    </>
  )
}

export const OrderInformationFragmentContainer = createFragmentContainer(OrderInformation, {
  order: graphql`
    fragment OrderInformation_order on CommerceOrder {
      code
      shippingTotal(precision: 2)
      taxTotal(precision: 2)
      buyerTotal(precision: 2)
      ... on CommerceOfferOrder {
        lastOffer {
          amount(precision: 2)
          fromParticipant
        }
      }
    }
  `,
  artwork: graphql`
    fragment OrderInformation_artwork on Artwork {
      listPrice {
        ... on Money {
          display
        }
        ... on PriceRange {
          display
        }
      }
    }
  `,
})
