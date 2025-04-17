import { Spacer, Text } from "@artsy/palette-mobile"
import { ArtworkExtraLinks_artwork$data } from "__generated__/ArtworkExtraLinks_artwork.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { navigate } from "app/system/navigation/navigate"
import { sendEmail } from "app/utils/sendEmail"
import { Schema } from "app/utils/track"
import { useTracking } from "react-tracking"
import { partnerName } from "./partnerName"

interface AuctionFaqSectionProps {
  artwork: ArtworkExtraLinks_artwork$data
  auctionState: AuctionTimerState
}

export const AuctionFaqSection: React.FC<AuctionFaqSectionProps> = ({ artwork, auctionState }) => {
  const { isInAuction, sale, isForSale } = artwork
  const { trackEvent } = useTracking()

  const handleReadOurAuctionFAQsTap = () => {
    trackEvent(tracks.tappedAuctionFAQs())
    navigate(`/auction-faq`)
  }
  const handleConditionsOfSaleTap = () => {
    trackEvent(tracks.tappedConditionsOfSale())
    navigate(`/conditions-of-sale`)
  }

  const handleAskASpecialistTap = (emailAddress: string) => {
    trackEvent(tracks.tappedAskASpecialist())

    const mailtoSubject = `Inquiry on ${artwork.title}`.concat(
      artwork.artist && artwork.artist.name ? ` by ${artwork.artist.name}` : ""
    )
    sendEmail(emailAddress, { subject: mailtoSubject })
  }

  if (isInAuction && sale && isForSale && auctionState !== AuctionTimerState.CLOSED) {
    return (
      <>
        <Text variant="xs" color="mono60">
          By placing a bid you agree to {partnerName(sale)}{" "}
          <Text
            variant="xs"
            style={{ textDecorationLine: "underline" }}
            onPress={() => handleConditionsOfSaleTap()}
          >
            Conditions of Sale
          </Text>
          .
        </Text>
        <Spacer y={1} />
        <Text variant="xs" color="mono60">
          Have a question?{" "}
          <Text
            variant="xs"
            style={{ textDecorationLine: "underline" }}
            onPress={() => handleReadOurAuctionFAQsTap()}
          >
            Read our auction FAQs
          </Text>{" "}
          or{" "}
          <Text
            variant="xs"
            style={{ textDecorationLine: "underline" }}
            onPress={() => handleAskASpecialistTap("specialist@artsy.net")}
          >
            ask a specialist
          </Text>
          .
        </Text>
      </>
    )
  }
  return null
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
