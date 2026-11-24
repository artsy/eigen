import {
  ConversationCTA_conversation$data,
  ConversationCTA_conversation$key,
} from "__generated__/ConversationCTA_conversation.graphql"
import { ConversationPartnerOfferCTA } from "app/Scenes/Inbox/Components/Conversations/ConversationPartnerOfferCTA"
import { findActiveConversationOrder } from "app/Scenes/Inbox/Components/Conversations/utils/findActiveConversationOrder"
import { usePartnerOffer } from "app/Scenes/Inbox/hooks/usePartnerOffer"
import { extractNodes } from "app/utils/extractNodes"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { graphql, useFragment } from "react-relay"
import { CTAPopUp } from "./CTAPopUp"
import { OpenInquiryModalButtonFragmentContainer } from "./OpenInquiryModalButton"
import { ReviewOfferButton, ReviewOfferCTAKind } from "./ReviewOfferButton"

interface Props {
  show: boolean
  conversation: ConversationCTA_conversation$key
}

export const ConversationCTA: React.FC<Props> = ({ conversation: _conversation, show }) => {
  const conversation = useFragment(conversationFragment, _conversation)
  const liveArtwork = conversation?.items?.[0]?.liveArtwork
  const { hasActivePartnerOffer } = usePartnerOffer({
    conversation,
    artworkId: liveArtwork?.__typename === "Artwork" ? liveArtwork.internalID : null,
  })

  if (!conversation?.internalID || liveArtwork?.__typename !== "Artwork") {
    return null
  }

  const activeOrder = findActiveConversationOrder(
    extractNodes(conversation.activeCollectorOrders),
    conversation.internalID
  )

  if (!activeOrder) {
    // When there's an active partner offer, the dedicated offer banner replaces
    // the inquiry transaction buttons.
    if (hasActivePartnerOffer) {
      return <ConversationPartnerOfferCTA conversation={conversation} />
    }

    if (
      liveArtwork.isOfferableFromInquiry ||
      liveArtwork.isOfferable ||
      liveArtwork.isAcquireable
    ) {
      return (
        <CTAPopUp show={show}>
          <OpenInquiryModalButtonFragmentContainer
            artwork={liveArtwork}
            conversationID={conversation.internalID}
          />
        </CTAPopUp>
      )
    }

    return null
  }

  const kind = getReviewOfferCTAKind(activeOrder)

  if (!kind) {
    return null
  }

  return (
    <CTAPopUp show={show}>
      <ReviewOfferButton
        kind={kind}
        activeOrder={activeOrder}
        conversationID={conversation.internalID}
      />
    </CTAPopUp>
  )
}

type ActiveOrder = ExtractNodeType<ConversationCTA_conversation$data["activeCollectorOrders"]>

/**
 * The banner comes from Exchange's `buyerAction`. Fulfilled offers (SHIPPED or
 * COMPLETED) have no action, but the app has always shown them as accepted.
 */
const getReviewOfferCTAKind = ({
  buyerAction,
  buyerState,
  mode,
}: ActiveOrder): ReviewOfferCTAKind | null => {
  if (mode === "BUY") return null
  if (buyerAction && buyerAction !== "%future added value") return buyerAction
  if (buyerState === "SHIPPED" || buyerState === "COMPLETED") return "OFFER_ACCEPTED"
  return null
}

const conversationFragment = graphql`
  fragment ConversationCTA_conversation on Conversation {
    ...ConversationPartnerOfferCTA_conversation
    ...usePartnerOffer_conversation

    internalID
    items {
      item {
        __typename
        ... on Artwork {
          artworkID: internalID
        }
      }
      liveArtwork {
        ... on Artwork {
          isOfferableFromInquiry
          isOfferable
          isAcquireable
          internalID
          __typename
          ...OpenInquiryModalButton_artwork
        }
      }
    }
    activeCollectorOrders: collectorOrdersConnection(
      first: 10
      buyerState: [
        SUBMITTED
        OFFER_RECEIVED
        COUNTEROFFER_SENT
        PAYMENT_FAILED
        PROCESSING_PAYMENT
        PROCESSING_OFFLINE_PAYMENT
        APPROVED
        SHIPPED
        COMPLETED
        REFUNDED
      ]
    ) {
      edges {
        node {
          internalID
          mode
          buyerAction
          buyerState
          buyerStateExpiresAt
          impulseConversationId
          lastSubmittedOffer {
            createdAt
          }
          submittedOffers {
            internalID
          }
        }
      }
    }
  }
`
