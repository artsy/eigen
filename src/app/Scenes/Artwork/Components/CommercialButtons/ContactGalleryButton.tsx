import { ActionType, OwnerType, TappedContactGallery } from "@artsy/cohesion"
import { ButtonProps, Button } from "@artsy/palette-mobile"
import { ContactGalleryButton_artwork$key } from "__generated__/ContactGalleryButton_artwork.graphql"
import { ContactGalleryButton_me$key } from "__generated__/ContactGalleryButton_me.graphql"
import { CompleteProfilePrompt } from "app/Scenes/Artwork/Components/CommercialButtons/CompleteProfilePrompt"
import { InquiryModal } from "app/Scenes/Artwork/Components/CommercialButtons/InquiryModal"
import { InquirySuccessNotification } from "app/Scenes/Artwork/Components/CommercialButtons/InquirySuccessNotification"
import { ArtworkInquiryStateProvider } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import React, { useState } from "react"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

type ContactGalleryButtonProps = Omit<ButtonProps, "children"> & {
  artwork: ContactGalleryButton_artwork$key
  me: ContactGalleryButton_me$key
}

export const ContactGalleryButton: React.FC<ContactGalleryButtonProps> = ({
  artwork,
  me,
  ...rest
}) => {
  const artworkData = useFragment(artworkFragment, artwork)
  const meData = useFragment(meFragment, me)
  const [modalVisibility, setModalVisibility] = useState(false)
  const { trackEvent } = useTracking()

  return (
    <ArtworkInquiryStateProvider>
      <InquirySuccessNotification />
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
        me={meData}
        modalIsVisible={modalVisibility}
        toggleVisibility={() => setModalVisibility(!modalVisibility)}
      />
      <CompleteProfilePrompt artwork={artworkData} />
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
  fragment ContactGalleryButton_artwork on Artwork {
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
    ...CompleteProfilePrompt_artwork
  }
`

const meFragment = graphql`
  fragment ContactGalleryButton_me on Me {
    ...InquiryModal_me
  }
`
