import { usePartnerOfferEvent_partnerOffers$key } from "__generated__/usePartnerOfferEvent_partnerOffers.graphql"
import { usePartnerOffer_conversation$key } from "__generated__/usePartnerOffer_conversation.graphql"
import { PartnerOfferConversationEvent } from "app/Scenes/Inbox/Components/Conversations/ConversationPartnerOfferUpdate"
import { usePartnerOffer } from "app/Scenes/Inbox/hooks/usePartnerOffer"
import { graphql, useFragment } from "react-relay"

interface UsePartnerOfferEventProps {
  conversation: usePartnerOffer_conversation$key
  artworkId?: string | null
}

/**
 * Builds the partner-offer entry shown in the conversation timeline, hiding the
 * Relay plumbing from `Messages`. It surfaces the matching offer when it is
 * still active or once it has been purchased, and tags it with `isPurchased`
 * (resolved server-side) so `ConversationPartnerOfferUpdate` can render the
 * right state.
 */
export const usePartnerOfferEvent = ({
  conversation,
  artworkId,
}: UsePartnerOfferEventProps): PartnerOfferConversationEvent | null => {
  const { hasActivePartnerOffer, partnerOffers: partnerOffersRef } = usePartnerOffer({
    conversation,
    artworkId,
  })

  const partnerOffers = useFragment(
    partnerOffersFragment,
    partnerOffersRef as unknown as usePartnerOfferEvent_partnerOffers$key
  )

  const partnerOffer = partnerOffers?.find((offer) => offer.artworkId === artworkId)

  if (!partnerOffer) {
    return null
  }

  const isPurchased = !!partnerOffer.isPurchased

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
    isPurchased
    ...ConversationPartnerOfferUpdate_partnerOffer
  }
`
