import { ActionType, ContextModule, ScreenOwnerType, TappedCreateAlert } from "@artsy/cohesion"
import { BellIcon, Button } from "@artsy/palette-mobile"
import { ArtworkScreenHeaderCreateAlert_artwork$data } from "__generated__/ArtworkScreenHeaderCreateAlert_artwork.graphql"
import { CreateSavedSearchModal } from "app/Components/Artist/ArtistArtworks/CreateSavedSearchModal"
import { useCreateArtworkAlert } from "app/utils/hooks/useCreateArtworkAlert"
import { isEmpty } from "lodash"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtworkScreenHeaderCreateAlertProps {
  artwork: ArtworkScreenHeaderCreateAlert_artwork$data
}

const ArtworkScreenHeaderCreateAlert: React.FC<ArtworkScreenHeaderCreateAlertProps> = ({
  artwork,
}) => {
  const { isForSale } = artwork
  const { trackEvent } = useTracking()
  const hasArtists = !isEmpty(artwork.artists) && artwork.artists!.length > 0

  const {
    entity,
    attributes,
    aggregations,
    showCreateArtworkAlertModal,
    closeCreateArtworkAlertModal,
    isCreateAlertModalVisible,
  } = useCreateArtworkAlert(artwork)

  if (!hasArtists) {
    return null
  }

  const handleCreateAlertPress = () => {
    showCreateArtworkAlertModal?.()
    const event = tracks.tappedCreateAlert({
      ownerId: entity?.owner.id!,
      ownerType: entity?.owner.type!,
      ownerSlug: entity?.owner.slug!,
    })

    trackEvent(event)
  }

  return (
    <>
      <Button
        size="small"
        variant={isForSale ? "outline" : "fillDark"}
        haptic
        onPress={handleCreateAlertPress}
        icon={<BellIcon fill={isForSale ? "black100" : "white100"} />}
      >
        Create Alert
      </Button>
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

export const ArtworkScreenHeaderCreateAlertFragmentContainer = createFragmentContainer(
  ArtworkScreenHeaderCreateAlert,
  {
    artwork: graphql`
      fragment ArtworkScreenHeaderCreateAlert_artwork on Artwork {
        title
        internalID
        slug
        isForSale
        artists {
          internalID
          name
        }
        attributionClass {
          internalID
        }
        mediumType {
          filterGene {
            slug
            name
          }
        }
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
    context_screen_owner_id: ownerId,
    context_screen_owner_slug: ownerSlug,
    context_module: "ArtworkScreenHeader" as ContextModule,
  }),
}
