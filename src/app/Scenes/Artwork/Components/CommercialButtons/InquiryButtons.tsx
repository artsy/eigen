import { ActionType, OwnerType, TappedContactGallery } from "@artsy/cohesion"
import { ButtonProps, Button } from "@artsy/palette-mobile"
import { InquiryButtons_artwork$data } from "__generated__/InquiryButtons_artwork.graphql"
import { InquiryButtons_me$data } from "__generated__/InquiryButtons_me.graphql"
import { InquirySuccessNotification } from "app/Scenes/Artwork/Components/CommercialButtons/InquirySuccessNotification"
import { MyProfileEditModal } from "app/Scenes/MyProfile/MyProfileEditModal"
import {
  ArtworkInquiryContext,
  ArtworkInquiryStateProvider,
} from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import { InquiryTypes, InquiryOptions } from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"
import React, { useContext, useState } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { InquiryModalFragmentContainer } from "./InquiryModal"
export type InquiryButtonsProps = Omit<ButtonProps, "children"> & {
  artwork: InquiryButtons_artwork$data
  me: InquiryButtons_me$data
}

const InquiryButtons: React.FC<InquiryButtonsProps> = ({ artwork, me, ...rest }) => {
  const [modalVisibility, setModalVisibility] = useState(false)
  const { trackEvent } = useTracking()
  const [notificationVisibility, setNotificationVisibility] = useState(false)
  const { state, dispatch } = useContext(ArtworkInquiryContext)
  const dispatchAction = (buttonText: string) => {
    dispatch({
      type: "selectInquiryType",
      payload: buttonText as InquiryTypes,
    })

    setModalVisibility(true)
  }

  return (
    <>
      <InquirySuccessNotification
        modalVisible={notificationVisibility}
        toggleNotification={(state: boolean) => setNotificationVisibility(state)}
      />
      <Button
        onPress={() => {
          trackEvent(tracks.trackTappedContactGallery(artwork.slug, artwork.internalID))
          dispatchAction(InquiryOptions.ContactGallery)
        }}
        haptic
        {...rest}
      >
        {InquiryOptions.ContactGallery}
      </Button>
      <InquiryModalFragmentContainer
        artwork={artwork}
        me={me}
        modalIsVisible={modalVisibility}
        toggleVisibility={() => setModalVisibility(!modalVisibility)}
        onMutationSuccessful={(state: boolean) => setNotificationVisibility(state)}
      />
      <MyProfileEditModal
        message={`Inquiry sent! Tell ${artwork.partner?.name || ""} more about yourself.`}
        onClose={() => dispatch({ type: "hideProfileUpdatePrompt" })}
        visible={state.isProfileUpdatePromptVisible}
      />
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
      partner {
        name
      }
      ...InquiryModal_artwork
    }
  `,
  me: graphql`
    fragment InquiryButtons_me on Me {
      ...InquiryModal_me
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
