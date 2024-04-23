import { Button, Flex, useSpace, Join, Spacer } from "@artsy/palette-mobile"
import { BuyNowButton_artwork$key } from "__generated__/BuyNowButton_artwork.graphql"
import { CreateArtworkAlertModal_artwork$key } from "__generated__/CreateArtworkAlertModal_artwork.graphql"
import { InquiryButtons_artwork$key } from "__generated__/InquiryButtons_artwork.graphql"
import { MakeOfferButton_artwork$key } from "__generated__/MakeOfferButton_artwork.graphql"
import { NotificationCommercialButtonsQuery } from "__generated__/NotificationCommercialButtonsQuery.graphql"
import { NotificationCommercialButtons_artwork$key } from "__generated__/NotificationCommercialButtons_artwork.graphql"
import { CreateArtworkAlertModal } from "app/Components/Artist/ArtistArtworks/CreateArtworkAlertModal"
import { PartnerOffer } from "app/Scenes/Activity/components/NotificationArtworkList"
import { BuyNowButton } from "app/Scenes/Artwork/Components/CommercialButtons/BuyNowButton"
import { InquiryButtonsFragmentContainer } from "app/Scenes/Artwork/Components/CommercialButtons/InquiryButtons"
import { MakeOfferButtonFragmentContainer } from "app/Scenes/Artwork/Components/CommercialButtons/MakeOfferButton"
import { navigate } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { getTimer } from "app/utils/getTimer"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { useState, Children } from "react"
import { QueryRenderer, graphql, useFragment } from "react-relay"

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
    | InquiryButtons_artwork$key
  partnerOffer?: PartnerOffer
  artworkID: string
}> = ({ artwork, partnerOffer, artworkID }) => {
  const artworkData = useFragment(artworkFragment, artwork)
  const [showCreateArtworkAlertModal, setShowCreateArtworkAlertModal] = useState(false)
  const space = useSpace()

  const { hasEnded } = getTimer(partnerOffer?.endAt || "")
  const noLongerAvailable = !partnerOffer?.isAvailable
  const enablePartnerOfferOnArtworkScreen = useFeatureFlag("AREnablePartnerOfferOnArtworkScreen")

  let renderComponent = null

  if (!!hasEnded) {
    if (!enablePartnerOfferOnArtworkScreen) {
      renderComponent = (
        <>
          <MakeOfferButtonFragmentContainer
            artwork={artworkData as MakeOfferButton_artwork$key}
            editionSetID={null}
          />
          <InquiryButtonsFragmentContainer
            artwork={artworkData as InquiryButtons_artwork$key}
            block
            variant="outline"
          />
        </>
      )
    } else {
      renderComponent = (
        <Button
          onPress={() => {
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
        />
      )
    } else {
      renderComponent = (
        <RowContainer>
          <Button
            onPress={() => {
              navigate(`/artwork/${artworkID}`, { passProps: { partnerOfferId: partnerOffer?.id } })
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
    ...InquiryButtons_artwork
    ...CreateArtworkAlertModal_artwork
  }
`
