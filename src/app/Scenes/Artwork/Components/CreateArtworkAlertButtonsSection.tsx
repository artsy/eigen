import { ActionType, ContextModule, ScreenOwnerType, TappedCreateAlert } from "@artsy/cohesion"
import { Spacer, Box, Text, Button } from "@artsy/palette-mobile"
import { CreateArtworkAlertButtonsSection_artwork$data } from "__generated__/CreateArtworkAlertButtonsSection_artwork.graphql"
import { CreateSavedSearchModal } from "app/Components/Artist/ArtistArtworks/CreateSavedSearchModal"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { useCreateArtworkAlert } from "app/utils/hooks/useCreateArtworkAlert"
import { FC } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { InquiryButtonsFragmentContainer } from "./CommercialButtons/InquiryButtons"

export interface CreateArtworkAlertButtonsSectionProps {
  artwork: CreateArtworkAlertButtonsSection_artwork$data
  // FIXME:- state manager can return a string different from AuctionTimerState
  // Check CountdownTimer.tsx
  auctionState?: AuctionTimerState | string
}

const CreateArtworkAlertButtonsSection: FC<CreateArtworkAlertButtonsSectionProps> = ({
  artwork,
  auctionState,
}) => {
  const tracking = useTracking()
  const { isInquireable, isInAuction, sale } = artwork
  const isInClosedAuction = isInAuction && sale && auctionState === AuctionTimerState.CLOSED

  const {
    entity,
    hasArtists,
    attributes,
    aggregations,
    showCreateArtworkAlertModal,
    closeCreateArtworkAlertModal,
    isCreateAlertModalVisible,
  } = useCreateArtworkAlert(artwork)

  const handleCreateAlertPress = () => {
    showCreateArtworkAlertModal()

    const event = tracks.tappedCreateAlert({
      ownerId: entity?.owner.id!,
      ownerType: entity?.owner.type!,
      ownerSlug: entity?.owner.slug!,
    })

    tracking.trackEvent(event)
  }

  return (
    <>
      <Box accessible accessibilityLabel="Create artwork alert buttons section">
        <Text variant="lg-display">{isInClosedAuction ? "Bidding closed" : "Sold"}</Text>
        {hasArtists && (
          <>
            <Text variant="xs" color="black60">
              Be notified when a similar work is available
            </Text>
            <Spacer y={2} />

            <Button block onPress={handleCreateAlertPress}>
              Create Alert
            </Button>
          </>
        )}

        {!!isInquireable && !isInClosedAuction && (
          <InquiryButtonsFragmentContainer artwork={artwork} variant="outline" mt={1} block />
        )}
      </Box>
      <CreateSavedSearchModal
        visible={isCreateAlertModalVisible}
        entity={entity!}
        attributes={attributes!}
        aggregations={aggregations!}
        closeModal={() => closeCreateArtworkAlertModal()}
      />
    </>
  )
}

export const CreateArtworkAlertButtonsSectionFragmentContainer = createFragmentContainer(
  CreateArtworkAlertButtonsSection,
  {
    artwork: graphql`
      fragment CreateArtworkAlertButtonsSection_artwork on Artwork {
        isInquireable
        isInAuction
        internalID
        slug
        title
        attributionClass {
          internalID
        }
        mediumType {
          filterGene {
            slug
            name
          }
        }
        artists {
          internalID
          name
        }
        sale {
          internalID
        }
        ...InquiryButtons_artwork
      }
    `,
  }
)

interface TappedCreateAlertOptions {
  ownerType: ScreenOwnerType
  ownerId: string
  ownerSlug: string
}

const tracks = {
  tappedCreateAlert: ({
    ownerType,
    ownerId,
    ownerSlug,
  }: TappedCreateAlertOptions): TappedCreateAlert => ({
    action: ActionType.tappedCreateAlert,
    context_screen_owner_type: ownerType,
    context_screen_owner_slug: ownerSlug,
    context_screen_owner_id: ownerId,
    context_module: "ArtworkTombstone" as ContextModule,
  }),
}
