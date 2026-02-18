import { ActionType, ContextModule, OwnerType, TappedViewWork } from "@artsy/cohesion"
import { Button, Flex, Join, Spacer } from "@artsy/palette-mobile"
import { BuyNowButton_artwork$key } from "__generated__/BuyNowButton_artwork.graphql"
import { MyProfileEditModal_me$key } from "__generated__/MyProfileEditModal_me.graphql"
import { NotificationCommercialButtonsQuery } from "__generated__/NotificationCommercialButtonsQuery.graphql"
import { NotificationCommercialButtons_artwork$key } from "__generated__/NotificationCommercialButtons_artwork.graphql"
import { useSendInquiry_me$key } from "__generated__/useSendInquiry_me.graphql"
import { CreateArtworkAlertModal } from "app/Components/Artist/ArtistArtworks/CreateArtworkAlertModal"
import { PartnerOffer } from "app/Scenes/Activity/components/PartnerOfferCreatedNotification"
import { BuyNowButton } from "app/Scenes/Artwork/Components/CommercialButtons/BuyNowButton"
import { useCreateAlertTracking } from "app/Scenes/SavedSearchAlert/useCreateAlertTracking"
import { RouterLink } from "app/system/navigation/RouterLink"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { getTimer } from "app/utils/getTimer"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { Children, useState } from "react"
import { QueryRenderer, graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

export const CommercialButtonsQueryRenderer: React.FC<{
  artworkID: string
  partnerOffer?: PartnerOffer | null
}> = ({ artworkID, partnerOffer }) => {
  return (
    <QueryRenderer<NotificationCommercialButtonsQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query NotificationCommercialButtonsQuery($artworkID: String!) {
          artwork(id: $artworkID) {
            internalID
            ...NotificationCommercialButtons_artwork
            ...CreateArtworkAlertModal_artwork
          }
        }
      `}
      variables={{ artworkID }}
      render={renderWithPlaceholder({
        Container: CommercialButtons,
        initialProps: { partnerOffer, artworkID },
        renderPlaceholder: () => <></>,
      })}
    />
  )
}

const RowContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
  const childArray = Children.map(children, (child) => {
    return <Flex flex={1}>{child}</Flex>
  })

  return (
    <Flex flexDirection="row" alignItems="center">
      <Join separator={<Spacer x={1} />}>{childArray}</Join>
    </Flex>
  )
}

export const CommercialButtons: React.FC<{
  artwork: NotificationCommercialButtons_artwork$key
  me: MyProfileEditModal_me$key & useSendInquiry_me$key
  partnerOffer?: PartnerOffer
  artworkID: string
}> = ({ artwork, partnerOffer, artworkID }) => {
  const artworkData = useFragment(artworkFragment, artwork)

  const [showCreateArtworkAlertModal, setShowCreateArtworkAlertModal] = useState(false)

  const { hasEnded } = getTimer(partnerOffer?.endAt || "")
  const noLongerAvailable = !partnerOffer?.isAvailable
  const tracking = useTracking()

  const { trackCreateAlertTap } = useCreateAlertTracking({
    contextScreenOwnerType: OwnerType.notification,
    contextScreenOwnerId: artworkID,
    contextModule: ContextModule.notification,
  })

  let renderComponent = null

  if (!!hasEnded) {
    renderComponent = (
      <RouterLink
        hasChildTouchable
        to={`/artwork/${artworkID}`}
        onPress={() => {
          tracking.trackEvent(tracks.tappedViewWork(artworkID, partnerOffer?.internalID || ""))
        }}
        navigationProps={{ artworkOfferExpired: true }}
      >
        <Button block accessibilityLabel="View Work">
          View Work
        </Button>
      </RouterLink>
    )
  } else if (!noLongerAvailable) {
    renderComponent = (
      <RowContainer>
        <RouterLink
          hasChildTouchable
          to={`/artwork/${artworkID}`}
          navigationProps={{ partnerOfferId: partnerOffer?.internalID }}
          onPress={() => {
            tracking.trackEvent(tracks.tappedViewWork(artworkID, partnerOffer.internalID))
          }}
        >
          <Button variant="outline" accessibilityLabel="View Work" block>
            View Work
          </Button>
        </RouterLink>

        <BuyNowButton
          artwork={artworkData as BuyNowButton_artwork$key}
          partnerOffer={partnerOffer}
          editionSetID={null}
          buttonText="Purchase"
          source="notification"
        />
      </RowContainer>
    )
  } else if (!!noLongerAvailable) {
    renderComponent = (
      <>
        <Button
          block
          variant="outline"
          onPress={() => {
            trackCreateAlertTap()
            setShowCreateArtworkAlertModal(true)
          }}
        >
          Create Alert
        </Button>

        <CreateArtworkAlertModal
          artwork={artworkData}
          onClose={() => setShowCreateArtworkAlertModal(false)}
          visible={showCreateArtworkAlertModal}
        />
      </>
    )
  }

  return (
    <Flex mx={2} gap={1}>
      {renderComponent}
    </Flex>
  )
}

const artworkFragment = graphql`
  fragment NotificationCommercialButtons_artwork on Artwork {
    ...MakeOfferButton_artwork
    ...BuyNowButton_artwork
    ...ContactGalleryButton_artwork
    ...CreateArtworkAlertModal_artwork
  }
`

const tracks = {
  tappedViewWork: (artworkID: string, partnerOfferId: string): TappedViewWork => ({
    action: ActionType.tappedViewWork,
    context_module: ContextModule.notification,
    context_screen_owner_type: OwnerType.notification,
    context_screen_owner_id: partnerOfferId,
    artwork_id: artworkID,
    notification_type: "offers",
  }),
}
