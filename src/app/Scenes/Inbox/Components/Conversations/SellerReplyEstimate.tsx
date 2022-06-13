import { SellerReplyEstimate_order$data } from "__generated__/SellerReplyEstimate_order.graphql"
import { track as _track } from "app/utils/track"
import { Flex, Separator, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface SellerReplyEstimateProps {
  order: SellerReplyEstimate_order$data
}

const getDeliveryEstimateMessage = (displayName: string) => {
  let estimate
  switch (displayName) {
    case "Rush":
      estimate = "1 business day"
      break
    case "Express":
      estimate = "2 business days"
      break
    case "Standard":
      estimate = "3-5 business days"
      break
  }

  return estimate
    ? `Your order will be delivered in ${estimate} once shipped, plus up to 7 days processing time.`
    : null
}

export const SellerReplyEstimate: React.FC<SellerReplyEstimateProps> = ({ order }) => {
  let message

  switch (order?.displayState) {
    case "SUBMITTED":
      if (!order.buyerAction || order.buyerAction !== "OFFER_RECEIVED_CONFIRM_NEEDED") {
        message = `The seller will respond to your offer by ${order.stateExpiresAt}. Keep in mind making an offer doesn’t guarantee you the work.`
      }
      break
    case "APPROVED":
      if (order.requestedFulfillment?.__typename !== "CommercePickup") {
        message = `Thank you for your purchase. You will be notified when the work has shipped, typically within 5–7 business days.`
      }
      break
    case "PROCESSING":
      message = getDeliveryEstimateMessage(
        order?.lineItems?.edges?.[0]?.node?.selectedShippingQuote?.displayName ?? ""
      )
      break
  }

  if (!message) {
    return null
  }

  return (
    <>
      <Flex flexDirection="column" p={2}>
        <Text variant="md">{message}</Text>
      </Flex>
      <Separator />
    </>
  )
}

export const SellerReplyEstimateFragmentContainer = createFragmentContainer(SellerReplyEstimate, {
  order: graphql`
    fragment SellerReplyEstimate_order on CommerceOrder {
      displayState
      stateExpiresAt(format: "MMM D")
      requestedFulfillment {
        __typename
      }
      ... on CommerceOfferOrder {
        buyerAction
      }
      lineItems {
        edges {
          node {
            selectedShippingQuote {
              displayName
            }
          }
        }
      }
    }
  `,
})
