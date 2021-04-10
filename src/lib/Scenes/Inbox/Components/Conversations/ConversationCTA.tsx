import { ConversationCTA_conversation } from "__generated__/ConversationCTA_conversation.graphql"
import { unsafe_getFeatureFlag } from "lib/store/GlobalStore"
import { extractNodes } from "lib/utils/extractNodes"
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
  // Determine whether we have a conversation about an artwork
  const firstItem = conversation?.items?.[0]?.item
  const artwork = firstItem?.__typename === "Artwork" ? firstItem : null
  const { artworkID, isOfferableFromInquiry } = { ...artwork }

  let CTA: JSX.Element | null = null

  const inquiryCheckoutEnabled = unsafe_getFeatureFlag("AROptionsInquiryCheckout")

  if (inquiryCheckoutEnabled && isOfferableFromInquiry) {
    // artworkID is guaranteed to be present if `isOfferableFromInquiry` was present.
    const conversationID = conversation.conversationID!
    const activeOrder = extractNodes(conversation.activeOrders)[0]
    if (!activeOrder) {
      CTA = <OpenInquiryModalButton artworkID={artworkID!} conversationID={conversationID} />
    } else {
      let ctaKind: ReviewOfferCTAKind | null = null
      const { lastTransactionFailed, state, lastOffer } = activeOrder

      if (lastTransactionFailed) {
        ctaKind = "PAYMENT_FAILED"
      } else if (state === "SUBMITTED" && lastOffer?.fromParticipant === "SELLER") {
        ctaKind = "OFFER_RECEIVED"
      } else if (state === "APPROVED" && lastOffer?.fromParticipant === "BUYER") {
        ctaKind = "OFFER_ACCEPTED"
      }
      if (ctaKind) {
        CTA = <ReviewOfferButton kind={ctaKind} activeOrder={activeOrder} conversationID={conversationID} />
      }
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
            isOfferableFromInquiry
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
