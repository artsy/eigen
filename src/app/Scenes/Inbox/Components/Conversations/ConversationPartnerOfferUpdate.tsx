import { MoneyFillIcon } from "@artsy/icons/native"
import { Flex, Spacer } from "@artsy/palette-mobile"
import { ConversationPartnerOfferUpdate_partnerOffer$key } from "__generated__/ConversationPartnerOfferUpdate_partnerOffer.graphql"
import { ConversationEventRow } from "app/Scenes/Inbox/Components/Conversations/ConversationEventRow"
import { TimeSince } from "app/Scenes/Inbox/Components/Conversations/TimeSince"
import { graphql, useFragment } from "react-relay"

export type PartnerOfferConversationEvent = ConversationPartnerOfferUpdate_partnerOffer$key & {
  readonly __typename: "PartnerOfferToCollector"
  readonly createdAt: string | null | undefined
  readonly isPurchased: boolean
}

interface ConversationPartnerOfferUpdateProps {
  partnerOffer: ConversationPartnerOfferUpdate_partnerOffer$key & { readonly isPurchased: boolean }
}

export const ConversationPartnerOfferUpdate: React.FC<ConversationPartnerOfferUpdateProps> = ({
  partnerOffer,
}) => {
  const data = useFragment(partnerOfferFragment, partnerOffer)

  if (partnerOffer.isPurchased) {
    return (
      <Flex>
        <ConversationEventRow
          Icon={MoneyFillIcon}
          iconFill="mono100"
          message="You purchased this artwork"
          textColor="mono100"
        />
        <Spacer y={2} />
      </Flex>
    )
  }

  const amountDisplay = data.priceWithDiscount?.display
  const message = amountDisplay
    ? `You received an offer for ${amountDisplay}`
    : "You received an offer"

  return (
    <Flex>
      <TimeSince style={{ alignSelf: "center" }} time={data.createdAt} exact mb={1} />
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

const partnerOfferFragment = graphql`
  fragment ConversationPartnerOfferUpdate_partnerOffer on PartnerOfferToCollector {
    createdAt
    priceWithDiscount {
      display
    }
  }
`
