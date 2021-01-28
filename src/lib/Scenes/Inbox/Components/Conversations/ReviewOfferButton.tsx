import { Button, Flex, Separator, Text } from "palette"
import React, { useState } from "react"
import styled from "styled-components/native"
import { MakeOfferModalQueryRenderer as MakeOfferModal } from "./MakeOfferModal"

export interface ReviewOfferButtonProps {
  offerID: string
}

export const ReviewOfferButton: React.FC<ReviewOfferButtonProps> = ({ offerID }) => {
  return (
    <>
      <Flex>
        <Text variant="mediumText">Offer status</Text>
        <Text variant="caption">bla bla bla</Text>
      </Flex>
    </>
  )
}

export const ReviewOfferButtonFragmentContainer = createFragmentContainer(ReviewOfferButtonRoute, {
  order: graphql`
    fragment ReviewOfferButton_order on CommerceOrder {
      __typename
      internalID
      code
      state
      mode
      stateReason
      stateExpiresAt(format: "MMM D")
      ... on CommerceOfferOrder {
        myLastOffer {
          internalID
          amount(precision: 2)
          amountCents
          shippingTotal(precision: 2)
          shippingTotalCents
          taxTotal(precision: 2)
          taxTotalCents
        }
      }
    }
  `,
})
