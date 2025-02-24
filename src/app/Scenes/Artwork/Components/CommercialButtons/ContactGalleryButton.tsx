import { ActionType, OwnerType } from "@artsy/cohesion"
import { ButtonProps, Button } from "@artsy/palette-mobile"
import { ContactGalleryButton_artwork$key } from "__generated__/ContactGalleryButton_artwork.graphql"
import { MyProfileEditModal_me$key } from "__generated__/MyProfileEditModal_me.graphql"
import { useSendInquiry_me$key } from "__generated__/useSendInquiry_me.graphql"
import { InquiryModal } from "app/Scenes/Artwork/Components/CommercialButtons/InquiryModal"
import { useAnalyticsContext } from "app/system/analytics/AnalyticsContext"
import {
  ArtworkInquiryContext,
  ArtworkInquiryStateProvider,
} from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import {
  CollectorSignals,
  getArtworkSignalTrackingFields,
} from "app/utils/getArtworkSignalTrackingFields"
import React from "react"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

type ContactGalleryButtonProps = Omit<ButtonProps, "children"> & {
  artwork: ContactGalleryButton_artwork$key
  me: MyProfileEditModal_me$key & useSendInquiry_me$key
}

export const ContactGalleryButton: React.FC<ContactGalleryButtonProps> = ({
  artwork,
  me,
  ...rest
}) => {
  const artworkData = useFragment(artworkFragment, artwork)

  const { trackEvent } = useTracking()
  const analytics = useAnalyticsContext()

  return (
    <ArtworkInquiryStateProvider>
      <ArtworkInquiryContext.Consumer>
        {({ dispatch }) => (
          <Button
            onPress={() => {
              trackEvent(
                tracks.trackTappedContactGallery(
                  analytics.contextScreenOwnerId || artworkData.internalID,
                  analytics.contextScreenOwnerSlug || artworkData.slug,
                  analytics.contextScreenOwnerType || OwnerType.artwork,
                  artworkData.collectorSignals,
                  analytics.contextModule
                )
              )
              dispatch({ type: "setInquiryModalVisible", payload: true })
            }}
            haptic
            {...rest}
          >
            Contact Gallery
          </Button>
        )}
      </ArtworkInquiryContext.Consumer>
      <InquiryModal artwork={artworkData} me={me} />
    </ArtworkInquiryStateProvider>
  )
}

// TODO: I temporarily removed TappedContactGallery type because it lacks the `context_owner_type` and `context_module` fields
// I should add them there first and bring back the time
const tracks = {
  trackTappedContactGallery: (
    contextOwnerId: string,
    contextOwnerSlug: string,
    contextOwnerType: string,
    collectorSignals: CollectorSignals,
    contextModule?: string
  ) => ({
    action: ActionType.tappedContactGallery,
    context_module: contextModule,
    context_owner_type: contextOwnerType,
    context_owner_id: contextOwnerId,
    context_owner_slug: contextOwnerSlug,
    ...getArtworkSignalTrackingFields(collectorSignals),
  }),
}

const artworkFragment = graphql`
  fragment ContactGalleryButton_artwork on Artwork {
    internalID
    slug
    collectorSignals {
      primaryLabel
      auction {
        bidCount
        lotWatcherCount
      }
    }
    ...InquiryModal_artwork
  }
`
