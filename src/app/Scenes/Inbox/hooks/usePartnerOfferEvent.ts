import { usePartnerOfferEvent_conversation$key } from "__generated__/usePartnerOfferEvent_conversation.graphql"
import { usePartnerOfferEvent_partnerOffers$key } from "__generated__/usePartnerOfferEvent_partnerOffers.graphql"
import { usePartnerOffer_me$key } from "__generated__/usePartnerOffer_me.graphql"
import { PartnerOfferConversationEvent } from "app/Scenes/Inbox/Components/Conversations/ConversationPartnerOfferUpdate"
import { usePartnerOffer } from "app/Scenes/Inbox/hooks/usePartnerOffer"
import { extractNodes } from "app/utils/extractNodes"
import { graphql, useFragment } from "react-relay"

interface UsePartnerOfferEventProps {
  me: usePartnerOffer_me$key
  artworkId?: string | null
  conversation: usePartnerOfferEvent_conversation$key
}

/**
 * Builds the partner-offer entry shown in the conversation timeline, hiding the
 * Relay plumbing from `Messages`. It surfaces the matching offer when it is
 * still active or once it has been fulfilled (purchased), and tags it with
 * `isPurchased` so `ConversationPartnerOfferUpdate` can render the right state.
 */
export const usePartnerOfferEvent = ({
  me,
  artworkId,
  conversation,
}: UsePartnerOfferEventProps): PartnerOfferConversationEvent | null => {
  const { hasActivePartnerOffer, partnerOffers: partnerOffersRef } = usePartnerOffer({
    me,
    artworkId,
  })

  const partnerOffers = useFragment(
    partnerOffersFragment,
    partnerOffersRef as unknown as usePartnerOfferEvent_partnerOffers$key
  )
  const { collectorOrdersConnection } = useFragment(conversationFragment, conversation)

  const partnerOffer = partnerOffers?.find((offer) => offer.artworkId === artworkId)

  if (!partnerOffer) {
    return null
  }

  // Only treat the offer as purchased if the order is in an active state
  // (SUBMITTED, APPROVED, or COMPLETED) and has a line item tied to this offer.
  // This prevents abandoned or canceled orders from showing a purchase confirmation.
  const PURCHASED_BUYER_STATES = new Set(["SUBMITTED", "APPROVED", "COMPLETED"])

  const isPurchased = extractNodes(collectorOrdersConnection).some(
    (order) =>
      PURCHASED_BUYER_STATES.has(order.buyerState ?? "") &&
      order.lineItems?.some((lineItem) => lineItem?.partnerOfferId === partnerOffer.internalID)
  )

  if (!hasActivePartnerOffer && !isPurchased) {
    return null
  }

  return { ...partnerOffer, isPurchased }
}

const partnerOffersFragment = graphql`
  fragment usePartnerOfferEvent_partnerOffers on PartnerOfferToCollector @relay(plural: true) {
    __typename
    internalID
    artworkId
    createdAt
    ...ConversationPartnerOfferUpdate_partnerOffer
  }
`

const conversationFragment = graphql`
  fragment usePartnerOfferEvent_conversation on Conversation {
    collectorOrdersConnection(first: 10) {
      edges {
        node {
          buyerState
          lineItems {
            partnerOfferId
          }
        }
      }
    }
  }
`
