import { ActionType, OwnerType, TappedContactGallery } from "@artsy/cohesion"
import { ButtonProps, Button } from "@artsy/palette-mobile"
import { InquiryButtons_artwork$data } from "__generated__/InquiryButtons_artwork.graphql"
import { InquirySuccessNotification } from "app/Scenes/Artwork/Components/CommercialButtons/InquirySuccessNotification"
import { getRandomAutomatedMessage } from "app/Scenes/Artwork/Components/CommercialButtons/constants"
import {
  ArtworkInquiryContext,
  ArtworkInquiryStateProvider,
} from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import React, { useContext } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { InquiryDrawerFragmentContainer } from "./InquiryDrawer"
export type InquiryButtonsProps = Omit<ButtonProps, "children"> & {
  artwork: InquiryButtons_artwork$data
}

const InquiryButtons: React.FC<InquiryButtonsProps> = ({ artwork, ...rest }) => {
  const { trackEvent } = useTracking()
  const { dispatch } = useContext(ArtworkInquiryContext)

  const handlePress = () => {
    trackEvent(tracks.trackTappedContactGallery(artwork.slug, artwork.internalID))
    dispatch({ type: "resetForm" })
    dispatch({ type: "setMessage", payload: getRandomAutomatedMessage() })
    dispatch({ type: "openInquiryDialog" })
  }

  return (
    <>
      <InquirySuccessNotification />
      <Button onPress={handlePress} haptic {...rest}>
        Contact Gallery
      </Button>
      <InquiryDrawerFragmentContainer artwork={artwork} />
    </>
  )
}

const InquiryButtonsWrapper: React.FC<InquiryButtonsProps> = (props) => (
  <ArtworkInquiryStateProvider>
    <InquiryButtons {...props} />
  </ArtworkInquiryStateProvider>
)

export const InquiryButtonsFragmentContainer = createFragmentContainer(InquiryButtonsWrapper, {
  artwork: graphql`
    fragment InquiryButtons_artwork on Artwork {
      image {
        url
        width
        height
      }
      slug
      internalID
      isPriceHidden
      title
      date
      medium
      dimensions {
        in
        cm
      }
      editionOf
      signatureInfo {
        details
      }
      artist {
        name
      }
      ...InquiryDrawer_artwork
    }
  `,
})

const tracks = {
  trackTappedContactGallery: (slug: string, internalID: string): TappedContactGallery => ({
    action: ActionType.tappedContactGallery,
    context_owner_type: OwnerType.artwork,
    context_owner_slug: slug,
    context_owner_id: internalID,
  }),
}
