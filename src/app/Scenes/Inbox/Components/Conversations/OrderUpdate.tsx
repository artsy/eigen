import {
  Spacer,
  MoneyFillIcon,
  AlertCircleFillIcon,
  IconProps,
  Flex,
  Text,
  LinkText,
  Color,
} from "@artsy/palette-mobile"
import { OrderUpdate_event$data } from "__generated__/OrderUpdate_event.graphql"

import { navigate } from "app/system/navigation/navigate"
import { createFragmentContainer, graphql } from "react-relay"
import { TimeSince } from "./TimeSince"

export interface OrderUpdateProps {
  event: OrderUpdate_event$data
  conversationId: string
}

export const OrderUpdate: React.FC<OrderUpdateProps> = ({ event, conversationId }) => {
  let color: Color
  let textColor: Color | null = null
  let message: string
  let Icon: React.FC<IconProps> = MoneyFillIcon
  let action: { label?: string; onPress?: () => void } = {}

  if (event.__typename === "%other") {
    return null
  }

  if (event.__typename === "CommerceOfferSubmittedEvent") {
    const { offer } = event
    const isCounter = offer.respondsTo !== null
    if (offer.fromParticipant === "BUYER") {
      color = "mono100"
      message = `You sent ${isCounter ? "a counteroffer" : "an offer"} for ${event.offer.amount}`
      if (!isCounter) {
        action = {
          label: "See details",
          onPress: () => navigate(`/conversation/${conversationId}/details`),
        }
      }
    } else if (offer.fromParticipant === "SELLER") {
      color = "orange150"
      Icon = AlertCircleFillIcon
      if (offer.offerAmountChanged) {
        message = `You received ${isCounter ? "a counteroffer" : "an offer"} for ${
          event.offer.amount
        }`
      } else {
        message = "Offer Accepted - Pending Action"
      }
    } else {
      // ignore future added value
      return null
    }
  } else if (event.__typename === "CommerceOrderStateChangedEvent") {
    const { orderUpdateState, state, stateReason } = event
    const reasonLapsed = stateReason?.includes("_lapsed")
    if (state === "APPROVED") {
      color = "green100"
      message = `${orderUpdateState === "offer_approved" ? "Offer" : "Purchase"} Accepted`
    } else if (orderUpdateState === "offer_processing_approval") {
      Icon = AlertCircleFillIcon
      color = "yellow100"
      textColor = "mono100"
      message = "Offer accepted. Payment Processing"
    } else if (orderUpdateState === "buy_processing_approval") {
      Icon = AlertCircleFillIcon
      color = "yellow100"
      textColor = "mono100"
      message = "Order approved. Payment Processing"
    } else if (orderUpdateState === "offer_rejected") {
      color = "red100"
      message = `Offer Declined`
    } else if (state === "CANCELED" && reasonLapsed) {
      color = "mono60"
      message = `${orderUpdateState === "offer_lapsed" ? "Offer" : "Purchase"} Expired`
    } else if (orderUpdateState === "buy_submitted") {
      color = "mono100"
      message = `You purchased this artwork`
      action = {
        label: "See details",
        onPress: () => navigate(`/conversation/${conversationId}/details`),
      }
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
          <Icon mt="1px" fill={color} />
          <Flex flexDirection="column" pl={1}>
            <Text color={textColor || color} variant="xs">
              {message}
              {!!action.label && !!action.onPress && (
                <>
                  {". "}
                  <LinkText variant="xs" onPress={action.onPress}>
                    {action.label}.
                  </LinkText>
                </>
              )}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Spacer y={2} />
    </Flex>
  )
}

export const OrderUpdateFragmentContainer = createFragmentContainer(OrderUpdate, {
  event: graphql`
    fragment OrderUpdate_event on CommerceOrderEventUnion {
      __typename
      ... on CommerceOrderStateChangedEvent {
        createdAt
        orderUpdateState
        state
        stateReason
      }
      ... on CommerceOfferSubmittedEvent {
        createdAt
        offer {
          amount
          fromParticipant
          definesTotal
          offerAmountChanged
          respondsTo {
            fromParticipant
          }
        }
      }
    }
  `,
})
