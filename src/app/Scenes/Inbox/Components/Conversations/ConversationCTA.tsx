import { ConversationCTA_conversation } from "__generated__/ConversationCTA_conversation.graphql"
import { unsafe_getFeatureFlag } from "app/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { CTAPopUp } from "./CTAPopUp"
import { OpenInquiryModalButton } from "./OpenInquiryModalButton"
import { ReviewOfferButton, ReviewOfferCTAKind } from "./ReviewOfferButton"

interface Props {
  show: boolean
  conversation: ConversationCTA_conversation
}

export const ConversationCTA: React.FC<Props> = ({ conversation, show }) => {
  const liveArtwork = conversation?.items?.[0]?.liveArtwork

  if (liveArtwork?.__typename !== "Artwork") {
    return null
  }

  const artworkID = liveArtwork?.internalID
  const isOfferableFromInquiry = liveArtwork?.isOfferableFromInquiry

  let CTA: JSX.Element | null = null

  const inquiryCheckoutEnabled = unsafe_getFeatureFlag("AROptionsInquiryCheckout")

  if (inquiryCheckoutEnabled) {
    // artworkID is guaranteed to be present if `isOfferableFromInquiry` was present.
    const conversationID = conversation.conversationID!

    const activeOrder = extractNodes(conversation.activeOrders)[0]
    if (!activeOrder) {
      if (isOfferableFromInquiry) {
        CTA = <OpenInquiryModalButton artworkID={artworkID!} conversationID={conversationID} />
      }
    } else {
      const { lastTransactionFailed, state, lastOffer } = activeOrder

      let kind: ReviewOfferCTAKind | null = null

      if (lastTransactionFailed) {
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
        const isProvisionalOffer =
          lastOffer?.fromParticipant === "SELLER" && lastOffer?.definesTotal
        kind = isProvisionalOffer ? "PROVISIONAL_OFFER_ACCEPTED" : "OFFER_ACCEPTED"
      }
      CTA = kind && (
        <ReviewOfferButton kind={kind} activeOrder={activeOrder} conversationID={conversationID} />
      )
    }
  }
  if (!CTA) {
    return null
  } else {
    return <CTAPopUp show={show}>{CTA}</CTAPopUp>
  }
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
            internalID
            __typename
          }
        }
      }
      activeOrders: orderConnection(first: 10, states: [APPROVED, FULFILLED, SUBMITTED, REFUNDED]) {
        edges {
          node {
            internalID
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
