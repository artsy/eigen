import { ArtworkExtraLinks_artwork } from "__generated__/ArtworkExtraLinks_artwork.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { navigate } from "app/navigation/navigate"
import { partnerName } from "app/Scenes/Artwork/Components/ArtworkExtraLinks/partnerName"
import { sendEmail } from "app/utils/sendEmail"
import { Schema } from "app/utils/track"
import { Sans, Spacer } from "palette"
import React from "react"
import { Text } from "react-native"
import { useTracking } from "react-tracking"

interface FaqAndSpecialistSectionProps {
  artwork: ArtworkExtraLinks_artwork
  auctionState: AuctionTimerState
}

export const FaqAndSpecialistSection: React.FC<FaqAndSpecialistSectionProps> = ({
  artwork,
  auctionState,
}) => {
  const { isAcquireable, isOfferable, isInAuction, sale, isForSale } = artwork
  const { trackEvent } = useTracking()

  const handleConditionsOfSaleTap = () => {
    trackEvent(tracks.tappedConditionsOfSale())
    navigate(`/conditions-of-sale`)
  }

  const handleReadOurAuctionFAQsTap = () => {
    trackEvent(tracks.tappedAuctionFAQs())
    navigate(`/auction-faq`)
  }

  const handleAskASpecialistTap = (emailAddress: string) => {
    trackEvent(tracks.tappedAskASpecialist())

    const mailtoSubject = `Inquiry on ${artwork.title}`.concat(
      artwork.artist && artwork.artist.name ? ` by ${artwork.artist.name}` : ""
    )
    sendEmail(emailAddress, { subject: mailtoSubject })
  }

  const handleReadOurFAQTap = () => {
    trackEvent(tracks.tappedFAQ())
    navigate(`/buy-now-feature-faq`)
  }

  if (isInAuction && sale && isForSale && auctionState !== AuctionTimerState.CLOSED) {
    return (
      <>
        <Sans size="2" color="black60">
          By placing a bid you agree to {partnerName(sale)}{" "}
          <Text
            style={{ textDecorationLine: "underline" }}
            onPress={() => handleConditionsOfSaleTap()}
          >
            Conditions of Sale
          </Text>
          .
        </Sans>
        <Spacer mb={1} />
        <Sans size="2" color="black60">
          Have a question?{" "}
          <Text
            style={{ textDecorationLine: "underline" }}
            onPress={() => handleReadOurAuctionFAQsTap()}
          >
            Read our auction FAQs
          </Text>{" "}
          or{" "}
          <Text
            style={{ textDecorationLine: "underline" }}
            onPress={() => handleAskASpecialistTap("specialist@artsy.net")}
          >
            ask a specialist
          </Text>
          .
        </Sans>
      </>
    )
  } else if (isAcquireable || isOfferable) {
    return (
      <Sans size="2" color="black60">
        Have a question?{" "}
        <Text style={{ textDecorationLine: "underline" }} onPress={() => handleReadOurFAQTap()}>
          Read our FAQ
        </Text>{" "}
        or{" "}
        <Text
          style={{ textDecorationLine: "underline" }}
          onPress={() => handleAskASpecialistTap("orders@artsy.net")}
        >
          ask a specialist
        </Text>
        .
      </Sans>
    )
  } else {
    return null
  }
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
  tappedFAQ: () => ({
    action_name: Schema.ActionNames.FAQ,
    action_type: Schema.ActionTypes.Tap,
    context_module: Schema.ContextModules.ArtworkExtraLinks,
  }),
}
