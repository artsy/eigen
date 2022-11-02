import { ArtworkLotDetails_artwork$key } from "__generated__/ArtworkLotDetails_artwork.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { navigate } from "app/navigation/navigate"
import { sendEmail } from "app/utils/sendEmail"
import { Schema } from "app/utils/track"
import { useArtworkBidding } from "app/Websockets/auctions/useArtworkBidding"
import { DateTime } from "luxon"
import { Join, LinkText, Spacer, Text } from "palette"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { partnerName } from "../ArtworkExtraLinks/partnerName"
import { ArtworkLotCascadingEndTimesBanner } from "./ArtworkLotCascadingEndTimesBanner"
import { ArtworkLotDetailsRow } from "./ArtworkLotDetailsRow"
import { getBidText } from "./helpers"

interface ArtworkLotDetailsProps {
  artwork: ArtworkLotDetails_artwork$key
  auctionState?: AuctionTimerState
}

export const ArtworkLotDetails: React.FC<ArtworkLotDetailsProps> = ({ artwork, auctionState }) => {
  const { trackEvent } = useTracking()
  const artworkData = useFragment(artworkFragment, artwork)
  const { isForSale, title, artist } = artworkData
  const {
    endAt: saleEndAt,
    cascadingEndTimeIntervalMinutes,
    extendedBiddingIntervalMinutes,
    isWithBuyersPremium,
    internalID,
  } = artworkData.sale ?? {}
  const {
    lotID,
    estimate,
    reserveMessage,
    currentBid,
    counts,
    endAt: lotEndAt,
    extendedBiddingEndAt,
  } = artworkData.saleArtwork ?? {}
  const isClosedAuctionState = auctionState === AuctionTimerState.CLOSED
  const isLiveAuctionState = auctionState === AuctionTimerState.LIVE_INTEGRATION_ONGOING
  const bidsCount = counts?.bidderPositions ?? 0
  const bidText = getBidText(bidsCount, reserveMessage ?? null)
  const shouldRender = !isClosedAuctionState && isForSale
  const shouldRenderBidRelatedInfo = shouldRender && !isLiveAuctionState

  console.log("[debug] auctionState", auctionState)

  const { currentBiddingEndAt } = useArtworkBidding({
    lotID,
    lotEndAt,
    biddingEndAt: extendedBiddingEndAt ?? lotEndAt ?? saleEndAt,
  })

  const handleBuyersPremiumTap = () => {
    navigate(`/auction/${internalID!}/buyers-premium`, {
      modal: true,
    })
  }

  const handleConditionsOfSaleTap = () => {
    trackEvent(tracks.tappedConditionsOfSale())
    navigate(`/conditions-of-sale`)
  }

  const handleReadOurAuctionFAQsTap = () => {
    trackEvent(tracks.tappedAuctionFAQs())
    navigate(`/auction-faq`)
  }

  const handleAskASpecialistTap = () => {
    trackEvent(tracks.tappedAskASpecialist())
    let mailtoSubject = `Inquiry on ${title}`

    if (artist?.name) {
      mailtoSubject = `${mailtoSubject} by ${artist.name}`
    }

    sendEmail("specialist@artsy.net", {
      subject: mailtoSubject,
    })
  }

  return (
    <Join separator={<Spacer mt={2} />}>
      {!!estimate && <ArtworkLotDetailsRow title="Estimated value" value={estimate} />}

      {/* CHECK SALE ARTWORK */}
      {/* CHECK LIVE AUCTION */}
      {!!(shouldRenderBidRelatedInfo && currentBid?.display) && (
        <ArtworkLotDetailsRow title={bidText} value={currentBid.display} />
      )}

      {!!(shouldRenderBidRelatedInfo && currentBiddingEndAt) && (
        <ArtworkLotDetailsRow title="Lot closes" value={formatEndDate(currentBiddingEndAt)} />
      )}

      {!!(shouldRenderBidRelatedInfo && cascadingEndTimeIntervalMinutes) && (
        <ArtworkLotCascadingEndTimesBanner
          cascadingEndTimeInterval={cascadingEndTimeIntervalMinutes}
          extendedBiddingIntervalMinutes={extendedBiddingIntervalMinutes}
        />
      )}

      {/* CHECK SALE ARTWORK */}
      {/* CHECK LIVE AUCTION */}
      {!!(shouldRenderBidRelatedInfo && isWithBuyersPremium) && (
        <Text variant="sm">
          This auction has a <LinkText onPress={handleBuyersPremiumTap}>buyer's premium</LinkText>.
        </Text>
      )}

      {!!shouldRender && (
        <Text variant="sm">
          By placing a bid you agree to {partnerName(artworkData.sale!)}{" "}
          <LinkText onPress={handleConditionsOfSaleTap}>Conditions of Sale</LinkText>.
        </Text>
      )}

      {!!shouldRender && (
        <Text variant="sm">
          Have a question?{" "}
          <LinkText onPress={handleReadOurAuctionFAQsTap}>Read our auction FAQs</LinkText> or{" "}
          <LinkText onPress={handleAskASpecialistTap}>ask a specialist</LinkText>.
        </Text>
      )}
    </Join>
  )
}

const artworkFragment = graphql`
  fragment ArtworkLotDetails_artwork on Artwork {
    isForSale
    title
    artist {
      name
    }
    sale {
      internalID
      endAt
      isWithBuyersPremium
      cascadingEndTimeIntervalMinutes
      extendedBiddingIntervalMinutes
      isBenefit
      partner {
        name
      }
    }
    saleArtwork {
      lotID
      estimate
      reserveMessage
      endAt
      endedAt
      extendedBiddingEndAt
      counts {
        bidderPositions
      }
      currentBid {
        display
      }
    }
  }
`

// TODO: Clarify format
const formatEndDate = (endAt: string) => {
  const date = DateTime.fromISO(endAt)

  return date.toFormat("MMM dd, h:mma")
}

// TODO: move track events to cohesion
const tracks = {
  tappedAskASpecialist: () => ({
    action_name: Schema.ActionNames.AskASpecialist,
    action_type: Schema.ActionTypes.Tap,
    context_module: Schema.ContextModules.ArtworkExtraLinks,
  }),
  tappedAuctionFAQs: () => ({
    action_name: Schema.ActionNames.AuctionsFAQ,
    action_type: Schema.ActionTypes.Tap,
    context_module: Schema.ContextModules.ArtworkExtraLinks,
  }),
  tappedConditionsOfSale: () => ({
    action_name: Schema.ActionNames.ConditionsOfSale,
    action_type: Schema.ActionTypes.Tap,
    context_module: Schema.ContextModules.ArtworkExtraLinks,
  }),
}
