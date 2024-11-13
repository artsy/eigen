import { Flex, HeartFillIcon, HeartIcon, Text, Touchable } from "@artsy/palette-mobile"
import {
  ArtworkGridItemSaveButtonQuery,
  ArtworkGridItemSaveButtonQuery$data,
} from "__generated__/ArtworkGridItemSaveButtonQuery.graphql"
import { useSaveArtworkToArtworkLists } from "app/Components/ArtworkLists/useSaveArtworkToArtworkLists"
import { ProgressiveOnboardingSaveArtwork } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingSaveArtwork"
import { HEART_ICON_SIZE } from "app/Components/constants"
import { NoFallback } from "app/utils/hooks/withSuspense"
import { useSaveArtwork } from "app/utils/mutations/useSaveArtwork"
import { ArtworkActionTrackingProps, tracks } from "app/utils/track/ArtworkActions"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtworkGridItemSaveButtonProps extends ArtworkActionTrackingProps {
  disableArtworksListPrompt: boolean
  id: string
  itemIndex?: number
}

export const ArtworkGridItemSaveButton = ({
  contextModule,
  contextScreen,
  contextScreenOwnerId,
  contextScreenOwnerSlug,
  contextScreenOwnerType,
  disableArtworksListPrompt,
  id,
  itemIndex,
}: ArtworkGridItemSaveButtonProps) => {
  const { trackEvent } = useTracking()
  const data = useLazyLoadQuery<ArtworkGridItemSaveButtonQuery>(
    graphql`
      query ArtworkGridItemSaveButtonQuery($id: String!) {
        artwork(id: $id) {
          id
          internalID
          isSaved
          availability
          isAcquireable
          isBiddable
          isInquireable
          isOfferable
          ...useSaveArtworkToArtworkLists_artwork
        }
      }
    `,
    {
      id,
    }
  )

  const artwork = data.artwork as NonNullable<ArtworkGridItemSaveButtonQuery$data["artwork"]>

  const onArtworkSavedOrUnSaved = (saved: boolean) => {
    const params = {
      acquireable: artwork.isAcquireable,
      availability: artwork.availability,
      biddable: artwork.isBiddable,
      context_module: contextModule,
      context_screen_owner_id: contextScreenOwnerId,
      context_screen_owner_slug: contextScreenOwnerSlug,
      context_screen_owner_type: contextScreenOwnerType,
      context_screen: contextScreen,
      inquireable: artwork.isInquireable,
      offerable: artwork.isOfferable,
    }
    trackEvent(tracks.saveOrUnsaveArtwork(saved, params))
  }

  const handleArtworkSave = useSaveArtwork({
    id: artwork.id,
    internalID: id,
    isSaved: !!data?.artwork?.isSaved,
    onCompleted: onArtworkSavedOrUnSaved,
  })

  const { isSaved, saveArtworkToLists } = useSaveArtworkToArtworkLists({
    artworkFragmentRef: artwork,
    onCompleted: onArtworkSavedOrUnSaved,
  })
  if (!data.artwork) {
    return null
  }

  return (
    <Touchable
      haptic
      onPress={disableArtworksListPrompt ? handleArtworkSave : saveArtworkToLists}
      testID="save-artwork-icon"
    >
      <ArtworkHeartIcon isSaved={!!isSaved} index={itemIndex} />
    </Touchable>
  )
}

const ArtworkHeartIcon: React.FC<{ isSaved: boolean | null; index?: number }> = ({
  isSaved,
  index,
}) => {
  const iconProps = { height: HEART_ICON_SIZE, width: HEART_ICON_SIZE, testID: "empty-heart-icon" }

  if (isSaved) {
    return <HeartFillIcon {...iconProps} testID="filled-heart-icon" fill="blue100" />
  }
  if (index === 0) {
    // We only try to show the save onboard Popover in the 1st element
    return (
      <ProgressiveOnboardingSaveArtwork>
        <HeartIcon {...iconProps} />
      </ProgressiveOnboardingSaveArtwork>
    )
  }
  return <HeartIcon {...iconProps} />
}

export const ArtworkGridItemSaveButtonQueryRenderer = (props: ArtworkGridItemSaveButtonProps) => {
  return (
    <Suspense fallback={ArtworkHeartIcon}>
      <ArtworkGridItemSaveButton {...props} />
    </Suspense>
  )
}
