import { ArtworkGridItem_artwork$data } from "__generated__/ArtworkGridItem_artwork.graphql"
import { ArtworkRailCard_artwork$data } from "__generated__/ArtworkRailCard_artwork.graphql"
import { useShareSheet } from "app/Components/ShareSheet/ShareSheetContext"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { cm2in } from "app/utils/conversions"
import { useCreateArtworkAlert } from "app/utils/hooks/useCreateArtworkAlert"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useSaveArtwork } from "app/utils/mutations/useSaveArtwork"
import { Schema } from "app/utils/track"
import { InteractionManager, Platform } from "react-native"
import { useTracking } from "react-tracking"

type Artwork = ArtworkRailCard_artwork$data | ArtworkGridItem_artwork$data

export const useArtworkContextMenu = (artwork: Artwork) => {
  const { title, isSaved, href, artists, slug, internalID, id, isHangable, image } = artwork
  const { trackEvent } = useTracking()
  const { showShareSheet } = useShareSheet()
  const enableInstantVIR = useFeatureFlag("AREnableInstantViewInRoom")
  const enableContextMenu = useFeatureFlag("AREnableArtworkContextMenu")
  const isIOS = Platform.OS === "ios"

  const shouldDisplayContextMenu = isIOS && enableContextMenu

  const shouldDisplayViewInRoom = LegacyNativeModules.ARCocoaConstantsModule.AREnabled && isHangable

  const {
    hasArtists,
    showCreateArtworkAlertModal,
    isCreateAlertModalVisible,
    entity,
    attributes,
    aggregations,
    closeCreateArtworkAlertModal,
  } = useCreateArtworkAlert(artwork)

  const handleArtworkSave = useSaveArtwork({
    id,
    internalID,
    isSaved,
    onCompleted: () => {
      // TODO: do we need tracking here?
    },
  })

  const openViewInRoom = () => {
    const heightIn = cm2in(artwork?.heightCm!)
    const widthIn = cm2in(artwork?.widthCm!)

    trackEvent({
      action_name: Schema.ActionNames.ViewInRoom,
      action_type: Schema.ActionTypes.Tap,
      // TODO: do we need tracking here?
      context_module: Schema.ContextModules.ArtworkActions,
    })

    LegacyNativeModules.ARTNativeScreenPresenterModule.presentAugmentedRealityVIR(
      image?.url!,
      widthIn,
      heightIn,
      slug,
      id,
      enableInstantVIR
    )
  }

  if (!shouldDisplayContextMenu) {
    return {
      artworkQuickActions: undefined,
      createAlertProperties: {
        isCreateAlertModalVisible: hasArtists ? isCreateAlertModalVisible : false,
        entity,
        attributes,
        aggregations,
        closeCreateArtworkAlertModal,
      },
    }
  }

  const getArtworkQuickActions = () => {
    const artworkQuickActions = [
      {
        title: isSaved ? "Remove from saved" : "Save",
        systemIcon: isSaved ? "heart.fill" : "heart",
        onPress: () => {
          // InteractionManager.runAfterInteractions(() => {
          handleArtworkSave()
          // })
        },
      },
      {
        title: "Share",
        systemIcon: "square.and.arrow.up",
        onPress: () => {
          InteractionManager.runAfterInteractions(() => {
            showShareSheet({
              type: "artwork",
              artists: artists,
              slug: slug,
              internalID: internalID,
              title: title!,
              href: href!,
              images: [],
            })
          })
        },
      },
    ]

    if (shouldDisplayViewInRoom) {
      artworkQuickActions.push({
        title: "View in room",
        systemIcon: "eye",
        onPress: () => {
          InteractionManager.runAfterInteractions(() => {
            openViewInRoom()
          })
        },
      })
    }

    if (hasArtists) {
      artworkQuickActions.push({
        title: "Create alert",
        systemIcon: "bell",
        onPress: () => {
          InteractionManager.runAfterInteractions(() => {
            showCreateArtworkAlertModal?.()
          })
        },
      })
    }

    return {
      artworkQuickActions,
      createAlertProperties: {
        isCreateAlertModalVisible,
        entity,
        attributes,
        aggregations,
        closeCreateArtworkAlertModal,
      },
    }
  }

  const artworkQuickActions = getArtworkQuickActions()
  return artworkQuickActions
}
