import { useColor } from "@artsy/palette-mobile"
import { ArtworkGridItem_artwork$data } from "__generated__/ArtworkGridItem_artwork.graphql"
import { ArtworkRailCard_artwork$data } from "__generated__/ArtworkRailCard_artwork.graphql"
import { useShareSheet } from "app/Components/ShareSheet/ShareSheetContext"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { cm2in } from "app/utils/conversions"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useSaveArtwork } from "app/utils/mutations/useSaveArtwork"
import { Schema } from "app/utils/track"
import React from "react"
import {
  InteractionManager,
  Platform,
  TouchableHighlight,
  TouchableHighlightProps,
} from "react-native"
import ContextMenu, { ContextMenuAction, ContextMenuProps } from "react-native-context-menu-view"
import Haptic, { HapticFeedbackTypes } from "react-native-haptic-feedback"
import { useTracking } from "react-tracking"

interface ContextAction extends Omit<ContextMenuAction, "subtitle"> {
  onPress?: () => void
}

interface ContextMenuArtworkProps extends TouchableHighlightProps {
  artwork: ArtworkRailCard_artwork$data | ArtworkGridItem_artwork$data
  onCreateAlertActionPress: () => void

  /**
   * `haptic` can be used like:
   *  `<ContextMenuArtwork haptic />`
   * or
   * `<ContextMenuArtwork haptic="impactHeavy" />`
   */
  haptic?: HapticFeedbackTypes | true
}

export const ContextMenuArtwork: React.FC<ContextMenuArtworkProps> = ({
  artwork,
  children,
  haptic,
  onPress,
  onLongPress,
  onCreateAlertActionPress,
  ...touchableProps
}) => {
  const color = useColor()
  const { trackEvent } = useTracking()
  const { showShareSheet } = useShareSheet()
  const enableInstantVIR = useFeatureFlag("AREnableInstantViewInRoom")
  const enableContextMenu = useFeatureFlag("AREnableArtworkContextMenu")
  const isIOS = Platform.OS === "ios"

  const { title, isSaved, href, artists, slug, internalID, id, isHangable, image } = artwork

  const shouldDisplayContextMenu = isIOS && enableContextMenu
  const enableCreateAlerts = !!artwork.artists?.length
  const enableViewInRoom = LegacyNativeModules.ARCocoaConstantsModule.AREnabled && isHangable

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

  const getContextMenuActions = () => {
    const contextMenuActions: ContextAction[] = [
      {
        title: isSaved ? "Remove from saved" : "Save",
        systemIcon: isSaved ? "heart.fill" : "heart",
        onPress: () => {
          handleArtworkSave()
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

  const triggerHaptic = () => {
    if (haptic) {
      Haptic.trigger(haptic === true ? "impactLight" : haptic)
    }
  }

  const handleTouchablePress: TouchableHighlightProps["onPress"] = (event) => {
    triggerHaptic()
    onPress?.(event)
  }

  const handleTouchableLongPress: TouchableHighlightProps["onLongPress"] = (event) => {
    triggerHaptic()
    onLongPress?.(event)
  }

  const handleContextPress: ContextMenuProps["onPress"] = (event) => {
    const onPressToCall = contextActions[event.nativeEvent.index].onPress

    triggerHaptic()
    onPressToCall?.()
  }

  return (
    <ContextMenu
      actions={contextActions}
      onPress={handleContextPress}
      disabled={!shouldDisplayContextMenu}
    >
      <TouchableHighlight
        underlayColor={color("white100")}
        activeOpacity={0.8}
        {...touchableProps}
        onPress={handleTouchablePress}
        onLongPress={handleTouchableLongPress}
      >
        {children}
      </TouchableHighlight>
    </ContextMenu>
  )
}
