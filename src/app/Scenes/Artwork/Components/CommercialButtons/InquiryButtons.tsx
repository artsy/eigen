import { ActionType, OwnerType, TappedContactGallery } from "@artsy/cohesion"
import { ButtonProps, Button } from "@artsy/palette-mobile"
import { InquiryButtons_artwork$key } from "__generated__/InquiryButtons_artwork.graphql"
import { InquiryModal } from "app/Scenes/Artwork/Components/CommercialButtons/InquiryModal"
import { InquirySuccessNotification } from "app/Scenes/Artwork/Components/CommercialButtons/InquirySuccessNotification"
import { ArtworkInquiryStateProvider } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import React, { useState } from "react"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

export type InquiryButtonsProps = Omit<ButtonProps, "children"> & {
  artwork: InquiryButtons_artwork$key
}

export const InquiryButtons: React.FC<InquiryButtonsProps> = ({ artwork, ...rest }) => {
  const artworkData = useFragment(artworkFragment, artwork)
  const [modalVisibility, setModalVisibility] = useState(false)
  const { trackEvent } = useTracking()
  const [notificationVisibility, setNotificationVisibility] = useState(false)

  return (
    <ArtworkInquiryStateProvider>
      <InquirySuccessNotification
        modalVisible={notificationVisibility}
        toggleNotification={(state: boolean) => setNotificationVisibility(state)}
      />
      <Button
        onPress={() => {
          trackEvent(tracks.trackTappedContactGallery(artworkData.slug, artworkData.internalID))
          setModalVisibility(true)
        }}
        haptic
        {...rest}
      >
        Contact Gallery
      </Button>
      <InquiryModal
        artwork={artworkData}
        modalIsVisible={modalVisibility}
        toggleVisibility={() => setModalVisibility(!modalVisibility)}
        onMutationSuccessful={(state: boolean) => setNotificationVisibility(state)}
      />
    </ArtworkInquiryStateProvider>
  )
}

const tracks = {
  trackTappedContactGallery: (slug: string, internalID: string): TappedContactGallery => ({
    action: ActionType.tappedContactGallery,
    context_owner_type: OwnerType.artwork,
    context_owner_slug: slug,
    context_owner_id: internalID,
  }),
}

const artworkFragment = graphql`
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
    ...InquiryModal_artwork
  }
`
