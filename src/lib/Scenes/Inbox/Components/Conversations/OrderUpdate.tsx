import { OrderUpdate_event } from "__generated__/OrderUpdate_event.graphql"
import { AlertCircleFillIcon, Color, Flex, IconProps, MoneyFillIcon, Spacer, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { TimeSince } from "./TimeSince"

export interface OrderUpdateProps {
  event: OrderUpdate_event
}

export const OrderUpdate: React.FC<OrderUpdateProps> = ({ event }) => {
  let color: Color
  let message: string
  let Icon: React.FC<IconProps> = MoneyFillIcon

  if (event.__typename === "CommerceOfferSubmittedEvent") {
    const { offer } = event
    const isCounter = offer.respondsTo !== null
    if (offer.fromParticipant === "BUYER") {
      color = "black100"
      message = `You sent ${isCounter ? "a counteroffer" : "an offer"} for ${event.offer.amount}`
    } else if (offer.fromParticipant === "SELLER") {
      color = "copper100"
      Icon = AlertCircleFillIcon
      message = `You received ${isCounter ? "a counteroffer" : "an offer"} for ${event.offer.amount}`
    } else {
      // ignore future added value
      return null
    }
  } else if (event.__typename === "CommerceOrderStateChangedEvent") {
    const { state, stateReason } = event
    if (state === "APPROVED") {
      color = "green100"
      message = `Offer Accepted`
    } else if (state === "CANCELED" && stateReason?.includes("_rejected")) {
      color = "red100"
      message = `Offer Declined`
    } else if (state === "CANCELED" && stateReason?.includes("_lapsed")) {
      color = "black60"
      message = `Offer Expired`
    } else {
      return null
    }
  } else {
    return null
  }
  return (
    <Flex>
      <TimeSince style={{ alignSelf: "center" }} time={event.createdAt} exact mb={1} />
      <Flex px={2} justifyContent="center" flexDirection="row">
        <Flex flexDirection="row">
          <Icon mt="3px" fill={color} />
          <Flex flexDirection="column" pl={1}>
            <Text color={color} variant="small">
              {message}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Spacer mb={2} />
    </Flex>
  )
}

export const OrderUpdateFragmentContainer = createFragmentContainer(OrderUpdate, {
  event: graphql`
    fragment OrderUpdate_event on CommerceOrderEventUnion {
      __typename
      ... on CommerceOrderStateChangedEvent {
        createdAt
        stateReason
        state
      }
      ... on CommerceOfferSubmittedEvent {
        createdAt
        offer {
          amount
          fromParticipant
          respondsTo {
            fromParticipant
          }
        }
      }
    }
  `,
})
