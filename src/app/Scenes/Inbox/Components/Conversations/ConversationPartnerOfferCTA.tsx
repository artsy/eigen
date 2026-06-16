import { ChevronRightIcon, StopwatchIcon } from "@artsy/icons/native"
import { Color, Flex, Text } from "@artsy/palette-mobile"
import { ConversationPartnerOfferCTA_conversation$key } from "__generated__/ConversationPartnerOfferCTA_conversation.graphql"
import { usePartnerOffer_me$key } from "__generated__/usePartnerOffer_me.graphql"
import { formattedTimeLeftForPartnerOffer } from "app/Scenes/Artwork/utils/formattedTimeLeftForPartnerOffer"
import { usePartnerOffer } from "app/Scenes/Inbox/hooks/usePartnerOffer"
import { RouterLink } from "app/system/navigation/RouterLink"
import { Time, getTimer } from "app/utils/getTimer"
import { DateTime } from "luxon"
import { useEffect, useRef, useState } from "react"
import { graphql, useFragment } from "react-relay"

interface ConversationPartnerOfferCTAProps {
  conversation: ConversationPartnerOfferCTA_conversation$key
  me: usePartnerOffer_me$key
}

/**
 * A sticky banner shown above the message composer when the collector has an
 * active personalized partner offer on the conversation's artwork. Tapping it
 * opens the artwork with the offer applied so the collector can review/checkout.
 */
export const ConversationPartnerOfferCTA: React.FC<ConversationPartnerOfferCTAProps> = ({
  conversation: _conversation,
  me,
}) => {
  const conversation = useFragment(fragment, _conversation)
  const artwork = conversation.items?.[0]?.item
  const artworkHref = artwork?.__typename === "Artwork" ? artwork.href : null
  const artworkId = artwork?.__typename === "Artwork" ? artwork.internalID : null

  const { partnerOffers: _partnerOffers, hasActivePartnerOffer } = usePartnerOffer({
    me,
    artworkId,
  })
  const partnerOffers = useFragment(partnerOfferFragment, _partnerOffers)
  const partnerOffer = partnerOffers?.find((p) => p.artworkId === artworkId)

  if (!artworkHref || !partnerOffer || !hasActivePartnerOffer) {
    return null
  }

  const title = partnerOffer.priceWithDiscount?.display
    ? `Offer received for ${partnerOffer.priceWithDiscount.display}`
    : "Offer received"

  const href = `${artworkHref}?partner_offer_id=${partnerOffer.internalID}`

  return (
    <RouterLink to={href} testID="partnerOfferActionLink">
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="blue10"
        width="100%"
        px={2}
        py={1}
      >
        <Flex flex={1} pr={1}>
          <Text variant="sm-display" color="mono100" fontWeight="bold">
            {title}
          </Text>

          <PartnerOfferExpiresIn endAt={partnerOffer.endAt as string} />
        </Flex>

        <ChevronRightIcon fill="mono100" />
      </Flex>
    </RouterLink>
  )
}

/**
 * A self-ticking countdown for the offer's expiry, mirroring the Activity feed's
 * ExpiresInTimer but decoupled from a notification fragment.
 */
const PartnerOfferExpiresIn: React.FC<{ endAt: string }> = ({ endAt }) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [{ time, hasEnded }, setTimer] = useState<{ time: Time; hasEnded: boolean }>(() =>
    getTimer(endAt)
  )

  useEffect(() => {
    const interval = DateTime.fromISO(endAt).diffNow().as("minutes") < 5 ? 1000 : 60000

    intervalRef.current = setInterval(() => {
      const { time: timerTime, hasEnded: timerHasEnded } = getTimer(endAt)
      setTimer({ time: timerTime, hasEnded: timerHasEnded })
    }, interval)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [endAt])

  if (hasEnded) {
    return (
      <Flex flexDirection="row" alignItems="center">
        <StopwatchIcon fill="red100" height={15} width={15} mr="2px" />
        <Text variant="xs" color="red100">
          Expired
        </Text>
      </Flex>
    )
  }

  const { timerCopy, textColor } = formattedTimeLeftForPartnerOffer(time)

  return (
    <Flex flexDirection="row" alignItems="center">
      <StopwatchIcon fill={textColor as Color} height={15} width={15} mr="2px" />
      <Text variant="xs" color={textColor as Color}>
        Expires in {timerCopy}
      </Text>
    </Flex>
  )
}

const fragment = graphql`
  fragment ConversationPartnerOfferCTA_conversation on Conversation {
    items {
      item {
        __typename
        ... on Artwork {
          internalID
          href
        }
      }
    }
  }
`

const partnerOfferFragment = graphql`
  fragment ConversationPartnerOfferCTA_partnerOffers on PartnerOfferToCollector
  @relay(plural: true) {
    internalID
    artworkId
    endAt
    priceWithDiscount {
      display
    }
  }
`
