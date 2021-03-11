import { OrderUpdate_event } from "__generated__/OrderUpdate_event.graphql"
import { AlertCircleFillIcon, Color, Flex, IconProps, MoneyFillIcon, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { TimeSince } from "./TimeSince"

export interface OrderUpdateProps {
  event: OrderUpdate_event
  showTimeSince: boolean
}

export const OrderUpdate: React.FC<OrderUpdateProps> = ({ event, showTimeSince }) => {
  let color: Color
  let message: string
  let Icon: React.FC<IconProps>
  if (event.__typename === "CommerceOfferSubmittedEvent") {
    console.warn(event)
    const { offer } = event
    const isCounter = offer.respondsTo !== null
    if (offer.fromParticipant === "BUYER") {
      color = "black100"
      Icon = MoneyFillIcon
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
    Icon = MoneyFillIcon

    const { state, stateReason } = event
    if (state === "APPROVED") {
      color = "green100"
      message = `Offer Accepted`
    } else if (state === "CANCELED" && stateReason?.includes("seller_rejected")) {
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
      {!!showTimeSince && (
        <Flex flexDirection="row" justifyContent="center">
          <TimeSince time={event.createdAt} mt={0.5} />
        </Flex>
      )}
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
