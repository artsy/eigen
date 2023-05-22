import { ArtworkGridItem_artwork$data } from "__generated__/ArtworkGridItem_artwork.graphql"
import { ArtworkRailCard_artwork$data } from "__generated__/ArtworkRailCard_artwork.graphql"
import { useSaveArtworkToArtworkLists } from "app/Components/ArtworkLists/useSaveArtworkToArtworkLists"
import { useShareSheet } from "app/Components/ShareSheet/ShareSheetContext"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { cm2in } from "app/utils/conversions"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Schema } from "app/utils/track"
import React from "react"
import { InteractionManager, Platform } from "react-native"
import ContextMenu, { ContextMenuAction, ContextMenuProps } from "react-native-context-menu-view"
import Haptic, { HapticFeedbackTypes } from "react-native-haptic-feedback"
import { useTracking } from "react-tracking"

interface ContextAction extends Omit<ContextMenuAction, "subtitle"> {
  onPress?: () => void
}

interface ContextMenuArtworkProps {
  artwork: ArtworkRailCard_artwork$data | ArtworkGridItem_artwork$data
  onCreateAlertActionPress: () => void
  haptic?: HapticFeedbackTypes | boolean
}

export const ContextMenuArtwork: React.FC<ContextMenuArtworkProps> = ({
  artwork,
  children,
  haptic = true,
  onCreateAlertActionPress,
}) => {
  const { trackEvent } = useTracking()
  const { showShareSheet } = useShareSheet()
  const enableInstantVIR = useFeatureFlag("AREnableInstantViewInRoom")
  const enableContextMenu = useFeatureFlag("AREnableArtworkContextMenu")
  const isIOS = Platform.OS === "ios"

  const { title, href, artists, slug, internalID, id, isHangable, image } = artwork

  const shouldDisplayContextMenu = isIOS && enableContextMenu
  const enableCreateAlerts = !!artwork.artists?.length
  const enableViewInRoom = LegacyNativeModules.ARCocoaConstantsModule.AREnabled && isHangable

  const { isSaved, saveArtworkToLists } = useSaveArtworkToArtworkLists({
    artworkFragmentRef: artwork,
    onCompleted:
      // TODO: Do we need to track anything here?
      () => null,
  })

  const openViewInRoom = () => {
    const heightIn = cm2in(artwork?.heightCm!)
    const widthIn = cm2in(artwork?.widthCm!)

    trackEvent({
      action_name: Schema.ActionNames.ViewInRoom,
      action_type: Schema.ActionTypes.Tap,
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

  const getContextMenuActions = () => {
    const contextMenuActions: ContextAction[] = [
      {
        title: isSaved ? "Remove from saved" : "Save",
        systemIcon: isSaved ? "heart.fill" : "heart",
        onPress: () => {
          saveArtworkToLists()
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

    if (enableViewInRoom) {
      contextMenuActions.push({
        title: "View in room",
        systemIcon: "eye",
        onPress: () => {
          InteractionManager.runAfterInteractions(() => {
            openViewInRoom()
          })
        },
      })
    }

    if (enableCreateAlerts) {
      contextMenuActions.push({
        title: "Create alert",
        systemIcon: "bell",
        onPress: () => {
          InteractionManager.runAfterInteractions(() => {
            onCreateAlertActionPress?.()
          })
        },
      })
    }

    return contextMenuActions
  }

  const contextActions = getContextMenuActions()

  const handleContextPress: ContextMenuProps["onPress"] = (event) => {
    if (haptic) {
      Haptic.trigger(haptic === true ? "impactLight" : haptic)
    }

    const onPressToCall = contextActions[event.nativeEvent.index].onPress

    onPressToCall?.()
  }

  if (!shouldDisplayContextMenu) {
    return <>{children}</>
  }

  return (
    <ContextMenu
      actions={contextActions}
      onPress={handleContextPress}
      previewPadding={20}
      disabled={!shouldDisplayContextMenu}
    >
      {children}
    </ContextMenu>
  )
}
