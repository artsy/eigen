import { ActionType, ContextModule, ScreenOwnerType, TappedCreateAlert } from "@artsy/cohesion"
import { BellIcon, Button } from "@artsy/palette-mobile"
import { ArtworkScreenHeaderCreateAlert_artwork$key } from "__generated__/ArtworkScreenHeaderCreateAlert_artwork.graphql"
import { CreateSavedSearchModal } from "app/Components/Artist/ArtistArtworks/CreateSavedSearchModal"
import { useCreateArtworkAlert } from "app/utils/hooks/useCreateArtworkAlert"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtworkScreenHeaderCreateAlertProps {
  artworkRef: ArtworkScreenHeaderCreateAlert_artwork$key
}

export const ArtworkScreenHeaderCreateAlert: React.FC<ArtworkScreenHeaderCreateAlertProps> = ({
  artworkRef,
}) => {
  const artwork = useFragment<ArtworkScreenHeaderCreateAlert_artwork$key>(
    ArtworkScreenHeaderCreateAlert_artwork,
    artworkRef
  )
  const { isForSale } = artwork
  const { trackEvent } = useTracking()

  const {
    hasArtists,
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

const ArtworkScreenHeaderCreateAlert_artwork = graphql`
  fragment ArtworkScreenHeaderCreateAlert_artwork on Artwork {
    isForSale
    ...useCreateArtworkAlert_artwork
  }
`

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
