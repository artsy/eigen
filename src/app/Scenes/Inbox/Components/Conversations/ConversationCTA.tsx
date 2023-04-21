import { ConversationCTA_conversation$data } from "__generated__/ConversationCTA_conversation.graphql"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { createFragmentContainer, graphql } from "react-relay"
import { CTAPopUp } from "./CTAPopUp"
import { OpenInquiryModalButtonFragmentContainer } from "./OpenInquiryModalButton"
import { ReviewOfferButton, ReviewOfferCTAKind } from "./ReviewOfferButton"

interface Props {
  show: boolean
  conversation: ConversationCTA_conversation$data
}

export const ConversationCTA: React.FC<Props> = ({ conversation, show }) => {
  const liveArtwork = conversation?.items?.[0]?.liveArtwork
  const enableConversationalBuyNow = useFeatureFlag("AREnableConversationalBuyNow")

  if (liveArtwork?.__typename !== "Artwork") {
    return null
  }

  const isOfferableFromInquiry = liveArtwork?.isOfferableFromInquiry
  const isOfferableConversationalBuyNow = liveArtwork?.isOfferable && enableConversationalBuyNow
  const conversationalBuyNow = liveArtwork?.isAcquireable && enableConversationalBuyNow

  // artworkID is guaranteed to be present if `isOfferableFromInquiry` was present.
  const conversationID = conversation.conversationID!

  const activeOrder = extractNodes(conversation.activeOrders)[0]

  if (!activeOrder) {
    if (isOfferableFromInquiry || isOfferableConversationalBuyNow || conversationalBuyNow) {
      return (
        <CTAPopUp show={show}>
          <OpenInquiryModalButtonFragmentContainer
            artwork={liveArtwork}
            conversationID={conversationID}
          />
        </CTAPopUp>
      )
    }
    return null
  }

  const { lastTransactionFailed, state, lastOffer, mode } = activeOrder
  let kind: ReviewOfferCTAKind | null = null

  if (mode === "BUY") {
    kind = null
  } else if (lastTransactionFailed) {
    kind = "PAYMENT_FAILED"
  } else if (state === "SUBMITTED" && lastOffer?.fromParticipant === "SELLER") {
    if (lastOffer.definesTotal) {
      // provisional inquery checkout offer scenarios where metadata was initially missing
      if (lastOffer.offerAmountChanged) {
        // Brown CTA: 'Counteroffer received - confirm total'
        kind = "OFFER_RECEIVED_CONFIRM_NEEDED"
      } else {
        // Brown CTA: 'Offer accepted - confirm total'
        kind = "OFFER_ACCEPTED_CONFIRM_NEEDED"
      }
    } else {
      // regular counter offer. either a definite offer on artwork with all metadata, or a provisional offer but metadata was provided in previous back and forth
      if (lastOffer.offerAmountChanged) {
        // Brown CTA: 'Counteroffer received'
        kind = "OFFER_RECEIVED"
      }
    }
  } else if (state === "FULFILLED") {
    kind = "OFFER_ACCEPTED"
  } else if (state === "APPROVED") {
    const isProvisionalOffer = lastOffer?.fromParticipant === "SELLER" && lastOffer?.definesTotal
    kind = isProvisionalOffer ? "PROVISIONAL_OFFER_ACCEPTED" : "OFFER_ACCEPTED"
  }

  if (kind) {
    return (
      <CTAPopUp show={show}>
        <ReviewOfferButton kind={kind} activeOrder={activeOrder} conversationID={conversationID} />
      </CTAPopUp>
    )
  }

  return null
}

export const ConversationCTAFragmentContainer = createFragmentContainer(ConversationCTA, {
  conversation: graphql`
    fragment ConversationCTA_conversation on Conversation {
      conversationID: internalID
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
      activeOrders: orderConnection(
        first: 10
        states: [APPROVED, FULFILLED, SUBMITTED, REFUNDED, PROCESSING_APPROVAL]
      ) {
        edges {
          node {
            internalID
            mode
            state
            stateReason
            stateExpiresAt
            lastTransactionFailed
            ... on CommerceOfferOrder {
              lastOffer {
                fromParticipant
                createdAt
                definesTotal
                offerAmountChanged
              }
              offers(first: 5) {
                edges {
                  node {
                    internalID
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
})
