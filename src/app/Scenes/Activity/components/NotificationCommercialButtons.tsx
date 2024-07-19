import { ActionType, ContextModule, OwnerType, TappedViewWork } from "@artsy/cohesion"
import { Button, Flex, useSpace, Join, Spacer } from "@artsy/palette-mobile"
import { BuyNowButton_artwork$key } from "__generated__/BuyNowButton_artwork.graphql"
import { ContactGalleryButton_artwork$key } from "__generated__/ContactGalleryButton_artwork.graphql"
import { ContactGalleryButton_me$key } from "__generated__/ContactGalleryButton_me.graphql"
import { CreateArtworkAlertModal_artwork$key } from "__generated__/CreateArtworkAlertModal_artwork.graphql"
import { MakeOfferButton_artwork$key } from "__generated__/MakeOfferButton_artwork.graphql"
import { NotificationCommercialButtonsQuery } from "__generated__/NotificationCommercialButtonsQuery.graphql"
import { NotificationCommercialButtons_artwork$key } from "__generated__/NotificationCommercialButtons_artwork.graphql"
import { NotificationCommercialButtons_me$key } from "__generated__/NotificationCommercialButtons_me.graphql"
import { CreateArtworkAlertModal } from "app/Components/Artist/ArtistArtworks/CreateArtworkAlertModal"
import { PartnerOffer } from "app/Scenes/Activity/components/NotificationArtworkList"
import { BuyNowButton } from "app/Scenes/Artwork/Components/CommercialButtons/BuyNowButton"
import { ContactGalleryButton } from "app/Scenes/Artwork/Components/CommercialButtons/ContactGalleryButton"
import { MakeOfferButtonFragmentContainer } from "app/Scenes/Artwork/Components/CommercialButtons/MakeOfferButton"
import { navigate } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { getTimer } from "app/utils/getTimer"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { useState, Children } from "react"
import { QueryRenderer, graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

export const CommercialButtonsQueryRenderer: React.FC<{
  artworkID: string
  partnerOffer?: PartnerOffer
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

const RowContainer: React.FC = ({ children }) => {
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
  artwork:
    | NotificationCommercialButtons_artwork$key
    | CreateArtworkAlertModal_artwork$key
    | BuyNowButton_artwork$key
    | MakeOfferButton_artwork$key
    | ContactGalleryButton_artwork$key
  me: NotificationCommercialButtons_me$key
  partnerOffer?: PartnerOffer
  artworkID: string
}> = ({ artwork, me, partnerOffer, artworkID }) => {
  const artworkData = useFragment(artworkFragment, artwork)
  const meData = useFragment(meFragment, me)
  const [showCreateArtworkAlertModal, setShowCreateArtworkAlertModal] = useState(false)
  const space = useSpace()

  const { hasEnded } = getTimer(partnerOffer?.endAt || "")
  const noLongerAvailable = !partnerOffer?.isAvailable
  const enablePartnerOfferOnArtworkScreen = useFeatureFlag("AREnablePartnerOfferOnArtworkScreen")
  const tracking = useTracking()

  let renderComponent = null

  if (!!hasEnded) {
    if (!enablePartnerOfferOnArtworkScreen) {
      renderComponent = (
        <>
          <MakeOfferButtonFragmentContainer
            artwork={artworkData as MakeOfferButton_artwork$key}
            editionSetID={null}
          />
          <ContactGalleryButton
            artwork={artworkData as ContactGalleryButton_artwork$key}
            me={meData as ContactGalleryButton_me$key}
            block
            variant="outline"
          />
        </>
      )
    } else {
      renderComponent = (
        <Button
          onPress={() => {
            tracking.trackEvent(tracks.tappedViewWork(artworkID, partnerOffer?.internalID || ""))

            navigate(`/artwork/${artworkID}`, { passProps: { artworkOfferExpired: true } })
          }}
          block
          accessibilityLabel="View Work"
        >
          View Work
        </Button>
      )
    }
  } else if (!noLongerAvailable) {
    if (!enablePartnerOfferOnArtworkScreen) {
      renderComponent = (
        <BuyNowButton
          artwork={artworkData as BuyNowButton_artwork$key}
          partnerOffer={partnerOffer}
          editionSetID={null}
          buttonText="Continue to Purchase"
          source="notification"
        />
      )
    } else {
      renderComponent = (
        <RowContainer>
          <Button
            onPress={() => {
              tracking.trackEvent(tracks.tappedViewWork(artworkID, partnerOffer.internalID))

              navigate(`/artwork/${artworkID}`, {
                passProps: { partnerOfferId: partnerOffer?.internalID },
              })
            }}
            variant="outline"
            accessibilityLabel="View Work"
            block
          >
            View Work
          </Button>

          <BuyNowButton
            artwork={artworkData as BuyNowButton_artwork$key}
            partnerOffer={partnerOffer}
            editionSetID={null}
            buttonText="Purchase"
            source="notification"
          />
        </RowContainer>
      )
    }
  } else if (!!noLongerAvailable) {
    renderComponent = (
      <>
        <Button block variant="outline" onPress={() => setShowCreateArtworkAlertModal(true)}>
          Create Alert
        </Button>

        <CreateArtworkAlertModal
          artwork={artwork as CreateArtworkAlertModal_artwork$key}
          onClose={() => setShowCreateArtworkAlertModal(false)}
          visible={showCreateArtworkAlertModal}
        />
      </>
    )
  }

  return (
    <Flex mx={2} gap={space(1)}>
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

const meFragment = graphql`
  fragment NotificationCommercialButtons_me on Me {
    ...ContactGalleryButton_me
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
