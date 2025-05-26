import { ActionType, OwnerType, TappedViewOffer } from "@artsy/cohesion"
import {
  ArrowRightIcon,
  MoneyFillIcon,
  AlertCircleFillIcon,
  IconProps,
  Flex,
  Text,
  Color,
} from "@artsy/palette-mobile"
import { ConversationCTA_conversation$data } from "__generated__/ConversationCTA_conversation.graphql"
import { navigate } from "app/system/navigation/navigate"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { useEventTiming } from "app/utils/useEventTiming"
import { DateTime } from "luxon"
import { TouchableWithoutFeedback } from "react-native"
import { useTracking } from "react-tracking"

export interface ReviewOfferButtonProps {
  conversationID: string
  kind: ReviewOfferCTAKind
  activeOrder: ExtractNodeType<ConversationCTA_conversation$data["activeOrders"]>
}

export type ReviewOfferCTAKind =
  | "PAYMENT_FAILED"
  | "OFFER_RECEIVED"
  | "OFFER_ACCEPTED"
  | "OFFER_ACCEPTED_CONFIRM_NEEDED"
  | "OFFER_RECEIVED_CONFIRM_NEEDED"
  | "PROVISIONAL_OFFER_ACCEPTED"

export const ReviewOfferButton: React.FC<ReviewOfferButtonProps> = ({
  conversationID,
  activeOrder,
  kind,
}) => {
  const { internalID: orderID, offers } = activeOrder
  const { trackEvent } = useTracking()

  const { hoursTillEnd, minutes } = useEventTiming({
    currentTime: DateTime.local().toString(),
    startAt: activeOrder.lastOffer?.createdAt,
    endAt: activeOrder.stateExpiresAt || undefined,
  })

  const expiresIn = Number(hoursTillEnd) < 1 ? `${minutes}m` : `${Math.round(hoursTillEnd)}hr`
  const offerType = (offers?.edges?.length || 0) > 1 ? "Counteroffer" : "Offer"

  let ctaAttributes: {
    backgroundColor: Color
    message: string
    subMessage: string
    Icon: React.FC<IconProps>
    url: string
    modalTitle: string
  }

  switch (kind) {
    case "PAYMENT_FAILED": {
      ctaAttributes = {
        backgroundColor: "red100",
        message: "Payment Failed",
        subMessage: "Unable to process payment for accepted offer. Update payment method.",
        Icon: AlertCircleFillIcon,
        url: `/orders/${orderID}/payment/new`,
        modalTitle: "Update Payment Details",
      }
      break
    }
    case "OFFER_RECEIVED": {
      ctaAttributes = {
        backgroundColor: "orange150",
        message: `${offerType} Received`,
        subMessage: `The offer expires in ${expiresIn}`,
        Icon: AlertCircleFillIcon,
        url: `/orders/${orderID}`,
        modalTitle: "Review Offer",
      }
      break
    }
    case "OFFER_ACCEPTED": {
      ctaAttributes = {
        backgroundColor: "green100",
        message: `Congratulations! ${offerType} Accepted`,
        subMessage: "Tap to view",
        Icon: MoneyFillIcon,
        url: `/orders/${orderID}`,
        modalTitle: "Offer Accepted",
      }
      break
    }
    case "OFFER_ACCEPTED_CONFIRM_NEEDED": {
      ctaAttributes = {
        backgroundColor: "orange150",
        message: `Offer Accepted - Confirm total`,
        subMessage: `The offer expires in ${expiresIn}`,
        Icon: AlertCircleFillIcon,
        url: `/orders/${orderID}`,
        modalTitle: "Review Offer",
      }
      break
    }
    case "OFFER_RECEIVED_CONFIRM_NEEDED": {
      ctaAttributes = {
        backgroundColor: "orange150",
        message: `Counteroffer Received - Confirm Total`,
        subMessage: `The offer expires in ${expiresIn}`,
        Icon: AlertCircleFillIcon,
        url: `/orders/${orderID}`,
        modalTitle: "Review Offer",
      }
      break
    }
    case "PROVISIONAL_OFFER_ACCEPTED": {
      ctaAttributes = {
        backgroundColor: "green100",
        message: `Offer Accepted`,
        subMessage: "Tap to view",
        Icon: MoneyFillIcon,
        url: `/orders/${orderID}`,
        modalTitle: "Offer Accepted",
      }
      break
    }
    default: {
      // this should never happen
      return null
    }
  }

  const { message, subMessage, backgroundColor, Icon, url, modalTitle } = ctaAttributes

  const navigateToConversation = (path: string, title: string) => {
    trackEvent(tracks.tappedViewOffer(conversationID, message))
    navigate(path, {
      modal: true,
      passProps: { orderID, title },
    })
  }

  return (
    <TouchableWithoutFeedback
      accessibilityRole="button"
      onPress={() => {
        navigateToConversation(url, modalTitle)
      }}
    >
      <Flex
        px={2}
        py={1}
        justifyContent="space-between"
        alignItems="center"
        bg={backgroundColor}
        flexDirection="row"
        minHeight={60}
      >
        <Flex flexDirection="row">
          <Icon mt="3px" fill="mono0" />
          <Flex flexDirection="column" pl={1}>
            <Text color="mono0" variant="sm">
              {message}
            </Text>
            <Text color="mono0" variant="xs">
              {subMessage}
            </Text>
          </Flex>
        </Flex>
        <Flex>
          <ArrowRightIcon fill="mono0" />
        </Flex>
      </Flex>
    </TouchableWithoutFeedback>
  )
}

const tracks = {
  tappedViewOffer: (conversationID: string, message: string): TappedViewOffer => ({
    action: ActionType.tappedViewOffer,
    context_owner_type: OwnerType.conversation,
    impulse_conversation_id: conversationID,
    subject: message,
  }),
}
