import { ConversationPartnerOfferCTA_partnerOffers$key } from "__generated__/ConversationPartnerOfferCTA_partnerOffers.graphql"
import { usePartnerOffer_conversation$key } from "__generated__/usePartnerOffer_conversation.graphql"
import { extractNodes } from "app/utils/extractNodes"
import { getTimer } from "app/utils/getTimer"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { graphql, useFragment } from "react-relay"

interface UsePartnerOfferProps {
  conversation: usePartnerOffer_conversation$key
  artworkId?: string | null
}

export const usePartnerOffer = ({ conversation, artworkId }: UsePartnerOfferProps) => {
  const data = useFragment(fragment, conversation)
  const isPartnerOfferConvoEnabled = useFeatureFlag("AREnableConversationPartnerOffers")

  const partnerOffers = extractNodes(data?.collectorPartnerOffersConnection)
  const partnerOffer = partnerOffers.find((p) => p.artworkId === artworkId) ?? undefined

  return {
    hasActivePartnerOffer:
      !!isPartnerOfferConvoEnabled && !!partnerOffer && isPartnerOfferActive(partnerOffer),
    partnerOffers: partnerOffers as ConversationPartnerOfferCTA_partnerOffers$key,
  }
}

const fragment = graphql`
  fragment usePartnerOffer_conversation on Conversation {
    collectorPartnerOffersConnection(first: 10, offerType: [PERSONALIZED]) {
      edges {
        node {
          ...ConversationPartnerOfferCTA_partnerOffers
          ...usePartnerOfferEvent_partnerOffers
          internalID
          artworkId
          endAt
          isAvailable
        }
      }
    }
  }
`

interface ConversationPartnerOffer {
  endAt?: string | null
  isAvailable?: boolean | null
}

/**
 * A partner offer is "active" — i.e. still actionable by the collector — when
 * it is marked available by Gravity and its expiry timer has not run out.
 */
const isPartnerOfferActive = (
  offer: ConversationPartnerOffer | undefined
): offer is ConversationPartnerOffer => {
  if (!offer || !offer.isAvailable || !offer.endAt) {
    return false
  }

  const { hasEnded } = getTimer(offer.endAt)
  return !hasEnded
}
