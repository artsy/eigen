/* eslint-disable react/no-unescaped-entities */
import { Spacer } from "@artsy/palette-mobile"
import { Box } from "@artsy/palette-mobile"
import { ArtworkLotDetails_artwork$key } from "__generated__/ArtworkLotDetails_artwork.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { partnerName } from "app/Scenes/Artwork/Components/ArtworkExtraLinks/partnerName"
import { navigate } from "app/system/navigation/navigate"
import { sendEmail } from "app/utils/sendEmail"
import { Schema } from "app/utils/track"
import { Join, LinkText, Text } from "palette"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { ArtworkLotDetailsRow } from "./ArtworkLotDetailsRow"
import { LotCascadingEndTimesBanner } from "./LotCascadingEndTimesBanner"
import { LotCurrentBidInfo } from "./LotCurrentBidInfo"
import { LotEndDateTime } from "./LotEndDateTime"
import { LotUpcomingLiveDateTime } from "./LotUpcomingLiveDateTime"

export interface ArtworkLotDetailsProps {
  artwork: ArtworkLotDetails_artwork$key
  auctionState?: AuctionTimerState
}

export const ArtworkLotDetails: React.FC<ArtworkLotDetailsProps> = ({ artwork, auctionState }) => {
  const { trackEvent } = useTracking()
  const artworkData = useFragment(artworkFragment, artwork)
  const { isForSale, title, artist, saleArtwork, sale } = artworkData
  const { isWithBuyersPremium, internalID, cascadingEndTimeIntervalMinutes } = sale ?? {}
  const { estimate, currentBid } = saleArtwork ?? {}
  const isClosedAuctionState = auctionState === AuctionTimerState.CLOSED
  const isLiveAuctionState = auctionState === AuctionTimerState.LIVE_INTEGRATION_ONGOING
  const shouldRenderInfo = !isClosedAuctionState && isForSale
  const shouldRenderExtraInfo = shouldRenderInfo && !isLiveAuctionState

  const handleBuyersPremiumTap = () => {
    navigate(`/auction/${internalID!}/buyers-premium`, {
      modal: true,
    })
  }

  const handleConditionsOfSaleTap = () => {
    trackEvent(tracks.tappedConditionsOfSale())
    navigate(`/conditions-of-sale`, {
      modal: true,
    })
  }

  const handleReadOurAuctionFAQsTap = () => {
    trackEvent(tracks.tappedAuctionFAQs())
    navigate(`/auction-faq`, {
      modal: true,
    })
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

  const renderLotDateTimeInfo = () => {
    if (auctionState === AuctionTimerState.LIVE_INTEGRATION_UPCOMING) {
      return <LotUpcomingLiveDateTime artwork={artworkData} />
    }

    return <LotEndDateTime artwork={artworkData} />
  }

  return (
    <Join separator={<Spacer y={2} />}>
      {!!estimate && <ArtworkLotDetailsRow title="Estimated value" value={estimate} />}

      {!!(shouldRenderExtraInfo && currentBid?.display) && (
        <Box accessibilityLabel="Bid info">
          <LotCurrentBidInfo artwork={artworkData} />
        </Box>
      )}

      {!!shouldRenderExtraInfo && renderLotDateTimeInfo()}

      {!!(shouldRenderExtraInfo && cascadingEndTimeIntervalMinutes) && (
        <LotCascadingEndTimesBanner sale={artworkData.sale!} />
      )}

      {!!(shouldRenderExtraInfo && isWithBuyersPremium) && (
        <Box testID="buyers-premium">
          <Text variant="sm">
            This auction has a <LinkText onPress={handleBuyersPremiumTap}>buyer's premium</LinkText>
            .
          </Text>
        </Box>
      )}

      {!!shouldRenderExtraInfo && (
        <Box testID="shipping-info">
          <Text variant="sm">Shipping, taxes, and additional fees may apply.</Text>
        </Box>
      )}

      {!!shouldRenderInfo && (
        <Text variant="sm" testID="conditions-of-sale">
          By placing a bid you agree to {partnerName(artworkData.sale!)}{" "}
          <LinkText onPress={handleConditionsOfSaleTap}>Conditions of Sale</LinkText>.
        </Text>
      )}

      {!!shouldRenderInfo && (
        <Text variant="sm" testID="have-a-question">
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
      isWithBuyersPremium
      cascadingEndTimeIntervalMinutes
      isBenefit
      partner {
        name
      }
      ...LotCascadingEndTimesBanner_sale
    }
    saleArtwork {
      estimate
      currentBid {
        display
      }
    }
    ...LotCurrentBidInfo_artwork
    ...LotEndDateTime_artwork
    ...LotUpcomingLiveDateTime_artwork
  }
`

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
