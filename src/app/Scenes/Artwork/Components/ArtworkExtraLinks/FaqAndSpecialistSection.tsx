import { FaqAndSpecialistSection_artwork$data } from "__generated__/FaqAndSpecialistSection_artwork.graphql"
import { navigate } from "app/navigation/navigate"
import { sendEmail } from "app/utils/sendEmail"
import { Schema } from "app/utils/track"
import { Sans } from "palette"
import React from "react"
import { Text } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface FaqAndSpecialistSectionProps {
  artwork: FaqAndSpecialistSection_artwork$data
}

const FaqAndSpecialistSection: React.FC<FaqAndSpecialistSectionProps> = ({ artwork }) => {
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

export const FaqAndSpecialistSectionFragmentContainer = createFragmentContainer(
  FaqAndSpecialistSection,
  {
    artwork: graphql`
      fragment FaqAndSpecialistSection_artwork on Artwork {
        isAcquireable
        isOfferable
        title
        artist {
          name
        }
      }
    `,
  }
)

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
