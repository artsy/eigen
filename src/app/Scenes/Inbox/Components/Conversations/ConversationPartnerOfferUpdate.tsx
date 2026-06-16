import { MoneyFillIcon } from "@artsy/icons/native"
import { Flex, Spacer } from "@artsy/palette-mobile"
import { ConversationEventRow } from "app/Scenes/Inbox/Components/Conversations/ConversationEventRow"
import { TimeSince } from "app/Scenes/Inbox/Components/Conversations/TimeSince"

/**
 * A synthetic, non-Relay event injected into the conversation timeline (see
 * `Messages`) to render a personalized partner offer — "You received an offer
 * for $X" — alongside the order-update events. The offer comes from
 * `me.partnerOffersConnection` (see `usePartnerOffer`), not from the order
 * history, which is why it is rendered separately from `OrderUpdate`.
 */
export interface PartnerOfferConversationEvent {
  __typename: "PartnerOfferEvent"
  createdAt: string | null
  amountDisplay: string | null
}

interface ConversationPartnerOfferUpdateProps {
  event: PartnerOfferConversationEvent
}

export const ConversationPartnerOfferUpdate: React.FC<ConversationPartnerOfferUpdateProps> = ({
  event,
}) => {
  const message = event.amountDisplay
    ? `You received an offer for ${event.amountDisplay}`
    : "You received an offer"

  return (
    <Flex>
      <TimeSince style={{ alignSelf: "center" }} time={event.createdAt} exact mb={1} />
      <ConversationEventRow
        Icon={MoneyFillIcon}
        iconFill="mono100"
        message={message}
        textColor="mono100"
      />
      <Spacer y={2} />
    </Flex>
  )
}
