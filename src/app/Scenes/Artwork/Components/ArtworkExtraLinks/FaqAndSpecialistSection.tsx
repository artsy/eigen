import { ArtworkExtraLinks_artwork } from "__generated__/ArtworkExtraLinks_artwork.graphql"
import { navigate } from "app/navigation/navigate"
import { sendEmail } from "app/utils/sendEmail"
import { Schema } from "app/utils/track"
import { Sans } from "palette"
import React from "react"
import { Text } from "react-native"
import { useTracking } from "react-tracking"

interface FaqAndSpecialistSectionProps {
  artwork: ArtworkExtraLinks_artwork
}

export const FaqAndSpecialistSection: React.FC<FaqAndSpecialistSectionProps> = ({ artwork }) => {
  const { isAcquireable, isOfferable } = artwork
  const { trackEvent } = useTracking()

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

  if (isAcquireable || isOfferable) {
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
  tappedFAQ: () => ({
    action_name: Schema.ActionNames.FAQ,
    action_type: Schema.ActionTypes.Tap,
    context_module: Schema.ContextModules.ArtworkExtraLinks,
  }),
}
