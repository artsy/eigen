import { tappedViewOffer } from "@artsy/cohesion"
import { navigate } from "lib/navigation/navigate"
import { useEventTiming } from "lib/utils/useEventTiming"
import { DateTime } from "luxon"
import { AlertCircleFillIcon, ArrowRightIcon, Color, Flex, IconProps, MoneyFillIcon, Text } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { useTracking } from "react-tracking"

export interface ReviewOfferButtonProps {
  conversationID: string
  kind: ReviewOfferCTAKind
  activeOrder: {
    internalID: string
    stateExpiresAt: string | null
    lastOffer?: { createdAt: string } | null
    offers?: { edges: { length: number } | null } | null
  }
}

export type ReviewOfferCTAKind = "PAYMENT_FAILED" | "OFFER_RECEIVED" | "OFFER_ACCEPTED"

export const ReviewOfferButton: React.FC<ReviewOfferButtonProps> = ({ conversationID, activeOrder, kind }) => {
  const { internalID: orderID, offers } = activeOrder
  const { trackEvent } = useTracking()

  const { hours } = useEventTiming({
    currentTime: DateTime.local().toString(),
    startAt: activeOrder.lastOffer?.createdAt,
    endAt: activeOrder.stateExpiresAt || undefined,
  })
  const offerType = (offers?.edges?.length || []) > 1 ? "Counteroffer" : "Offer"

  let ctaAttributes: { backgroundColor: Color; message: string; subMessage: string; Icon: React.FC<IconProps> }

  switch (kind) {
    case "PAYMENT_FAILED": {
      ctaAttributes = {
        backgroundColor: "red100",
        message: "Payment Failed",
        subMessage: "Please update payment method",
        Icon: AlertCircleFillIcon,
      }
      break
    }
    case "OFFER_RECEIVED": {
      ctaAttributes = {
        backgroundColor: "copper100",
        message: `${offerType} Received`,
        // TODO: what about <1 hr?
        subMessage: `Expires in ${hours}hr`,
        Icon: AlertCircleFillIcon,
      }
      break
    }
    case "OFFER_ACCEPTED": {
      ctaAttributes = {
        backgroundColor: "green100",
        message: `Congratulations! ${offerType} Accepted`,
        subMessage: "Tap to view",
        Icon: MoneyFillIcon,
      }
      break
    }
    default: {
      // this should never happen
      return null
    }
  }

  const { message, subMessage, backgroundColor, Icon } = ctaAttributes

  const navigateToConversation = () => {
    trackEvent(
      tappedViewOffer({
        impulse_conversation_id: conversationID,
        cta: message,
      })
    )
    navigate(`/orders/${orderID}`, {
      modal: true,
      passProps: { orderID, title: "Make Offer" },
    })
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigateToConversation()
      }}
    >
      <Flex
        px={2}
        justifyContent="space-between"
        alignItems="center"
        bg={backgroundColor}
        flexDirection="row"
        height={60}
      >
        <Flex flexDirection="row">
          <Icon mt="3px" fill="white100" />
          <Flex flexDirection="column" pl={1}>
            <Text color="white100" variant="mediumText">
              {message}
            </Text>
            <Text color="white100" variant="caption">
              {subMessage}
            </Text>
          </Flex>
        </Flex>
        <Flex>
          <ArrowRightIcon fill="white100" />
        </Flex>
      </Flex>
    </TouchableWithoutFeedback>
  )
}
