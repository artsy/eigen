import { ArrowRightIcon, Button, Flex, Separator, Text } from "palette"
import React, { useState } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

// export interface ReviewOfferButtonProps {
//   order: ReviewOfferButton_order
// }
export const ReviewOfferButton: React.FC = () => {
  // export const ReviewOfferButton: React.FC<ReviewOfferButtonProps> = ({ offerID }) => {
  let backgroundColor = ""
  let message = ""
  let webviewPath = ""
  let subMessage = "Tap to view"

  const order = {
    internalID: "",
    state: "",
    lastOffer: {
      fromParticipant: "",
    },
    stateExpiresAt: ""
  }

  if (order.state === "APPROVED") {
    message = "Offer Accepted - Please Confirm"
    backgroundColor = "green100"
    webviewPath = `/orders/${order.internalID}/status`
  } else if (order.state === "CANCELED") {
    message = "Offer Declined"
    backgroundColor = "red100"
    webviewPath = `/orders/${order.internalID}/status`
  } else if (order.lastOffer.fromParticipant === "SELLER") {
    backgroundColor = "copper100"
    message = "Counteroffer Received"
    subMessage =
  }

  return (
      <Flex justifyContent="space-between">
        <Flex flexDirection="column">
          <Text variant="mediumText">Offer status</Text>
          <Text variant="caption">bla bla bla</Text>
        </Flex>
        <Flex>
          <ArrowRightIcon />
        </Flex>
      </Flex>
  )
}

// export const ReviewOfferButtonFragmentContainer = createFragmentContainer(ReviewOfferButton, {
//   order: graphql`
//     fragment ReviewOfferButton_order on CommerceOrder {
//       __typename
//       internalID
//       code
//       state
//       mode
//       stateReason
//       stateExpiresAt(format: "MMM D")
//       ... on CommerceOfferOrder {
//         lastOffer {
//           fromParticipant
//         }
//       }
//     }
//   `,
// })
