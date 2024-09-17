import { ActionType, ContextModule, LongPressedArtwork, ScreenOwnerType } from "@artsy/cohesion"
import { useColor } from "@artsy/palette-mobile"
import { ArtworkGridItem_artwork$data } from "__generated__/ArtworkGridItem_artwork.graphql"
import { ArtworkRailCard_artwork$data } from "__generated__/ArtworkRailCard_artwork.graphql"
import { useSaveArtworkToArtworkLists } from "app/Components/ArtworkLists/useSaveArtworkToArtworkLists"
import { ArtworkRailCardProps } from "app/Components/ArtworkRail/ArtworkRailCard"
import { ContextMenuArtworkPreviewCard } from "app/Components/ContextMenu/ContextMenuArtworkPreviewCard"
import { useShareSheet } from "app/Components/ShareSheet/ShareSheetContext"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { cm2in } from "app/utils/conversions"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useDislikeArtwork } from "app/utils/mutations/useDislikeArtwork"
import { Schema } from "app/utils/track"
import { isEmpty } from "lodash"
import { InteractionManager, Platform } from "react-native"
import ContextMenu, { ContextMenuAction, ContextMenuProps } from "react-native-context-menu-view"
import { HapticFeedbackTypes, trigger } from "react-native-haptic-feedback"
import { useTracking } from "react-tracking"

interface ContextAction extends Omit<ContextMenuAction, "subtitle"> {
  onPress?: () => void
}

export type ArtworkDisplayProps = Pick<
  ArtworkRailCardProps,
  | "dark"
  | "hideArtistName"
  | "showPartnerName"
  | "isRecentlySoldArtwork"
  | "lotLabel"
  | "lowEstimateDisplay"
  | "highEstimateDisplay"
  | "performanceDisplay"
  | "priceRealizedDisplay"
>

interface ContextMenuArtworkProps {
  artwork: ArtworkRailCard_artwork$data | ArtworkGridItem_artwork$data
  onCreateAlertActionPress: () => void
  onSupressArtwork?: () => void
  haptic?: HapticFeedbackTypes | boolean
  artworkDisplayProps?: ArtworkDisplayProps
  contextScreenOwnerType?: ScreenOwnerType
  contextModule?: ContextModule
}

export const ContextMenuArtwork: React.FC<ContextMenuArtworkProps> = ({
  artwork,
  children,
  haptic = true,
  artworkDisplayProps,
  onCreateAlertActionPress,
  onSupressArtwork,
  contextScreenOwnerType,
  contextModule,
}) => {
  const { trackEvent } = useTracking()
  const { showShareSheet } = useShareSheet()
  const enableContextMenuForRecommendations =
    useFeatureFlag("AREnableLongPressOnNewForYouRail") && contextModule == "newWorksForYouRail"
  const enableContextMenu =
    useFeatureFlag("AREnableLongPressOnArtworkCards") || enableContextMenuForRecommendations
  const { submitMutation: dislikeArtworkMutation } = useDislikeArtwork()
  const isIOS = Platform.OS === "ios"
  const color = useColor()

  const dark = artworkDisplayProps?.dark ?? false

  const { title, href, artists, slug, internalID, id, isHangable, image, sale } = artwork

  const shouldDisplayContextMenu = isIOS && enableContextMenu
  const enableCreateAlerts = !!artwork.artists?.length
  const enableViewInRoom = LegacyNativeModules.ARCocoaConstantsModule.AREnabled && isHangable
  const enableSupressArtwork = contextModule == "newWorksForYouRail"

  const isOpenSale = !isEmpty(sale) && sale?.isAuction && !sale?.isClosed

  const { isSaved, saveArtworkToLists } = useSaveArtworkToArtworkLists({
    artworkFragmentRef: artwork,
    onCompleted:
      // TODO: Do we need to track anything here?
      () => null,
  })

  const openViewInRoom = () => {
    if (artwork?.widthCm == null || artwork?.heightCm == null || image?.url == null) {
      return
    }

    const heightIn = cm2in(artwork.heightCm)
    const widthIn = cm2in(artwork.widthCm)

    trackEvent({
      action_name: Schema.ActionNames.ViewInRoom,
      action_type: Schema.ActionTypes.Tap,
      context_module: Schema.ContextModules.ArtworkActions,
    })

    LegacyNativeModules.ARTNativeScreenPresenterModule.presentAugmentedRealityVIR(
      image.url,
      widthIn,
      heightIn,
      slug,
      id
    )
  }

  const getContextMenuActions = () => {
    const contextMenuActions: ContextAction[] = [
      {
        title: "Share",
        systemIcon: "square.and.arrow.up",
        onPress: () => {
          if (title && href) {
            InteractionManager.runAfterInteractions(() => {
              showShareSheet({
                type: "artwork",
                artists: artists,
                slug: slug,
                internalID: internalID,
                title: title,
                href: href,
                images: [],
              })
            })
          }
        },
      },
    ]

    if (!enableSupressArtwork) {
      let saveTitle = isSaved ? "Remove from saved" : "Save"
      if (isOpenSale) {
        saveTitle = "Watch Lot"
      }

      contextMenuActions.unshift({
        title: saveTitle,
        systemIcon: isSaved ? "heart.fill" : "heart",
        onPress: () => {
          saveArtworkToLists()
        },
      })
    }

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

    if (enableSupressArtwork) {
      contextMenuActions.push({
        title: "Hide",
        systemIcon: "eye.slash",
        onPress: () => {
          InteractionManager.runAfterInteractions(() => {
            onSupressArtwork?.()
            dislikeArtworkMutation({ variables: { artworkID: internalID } })
          })
        },
      })
    }

    if (enableCreateAlerts) {
      // Put create alert at front since it is high intent
      contextMenuActions.unshift({
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
      trigger?.(haptic === true ? "impactLight" : haptic)
    }

    const onPressToCall = contextActions[event.nativeEvent.index].onPress

    if (contextModule && contextScreenOwnerType) {
      trackEvent(tracks.longPressedArtwork(contextModule, contextScreenOwnerType, artwork.id))
    }

    onPressToCall?.()
  }

  const handleContextCancel: ContextMenuProps["onCancel"] = () => {
    // There is not an event for callback for when context menu shows so instead track
    // the 2 possibilities, an action was taken or the menu was cancelled
    if (contextModule && contextScreenOwnerType) {
      trackEvent(tracks.longPressedArtwork(contextModule, contextScreenOwnerType, artwork.id))
    }
  }

  const tracks = {
    longPressedArtwork: (
      contextModule: ContextModule,
      screenOwnerType: ScreenOwnerType,
      artworkId: string
    ): LongPressedArtwork => ({
      action: ActionType.longPressedArtwork,
      context_module: contextModule,
      context_screen_owner_type: screenOwnerType,
      context_screen_owner_id: artworkId,
    }),
  }

  if (!shouldDisplayContextMenu) {
    return <>{children}</>
  }

  const artworkPreviewComponent = (
    artwork: ArtworkRailCard_artwork$data | ArtworkGridItem_artwork$data
  ) => {
    return (
      <ContextMenuArtworkPreviewCard artwork={artwork} artworkDisplayProps={artworkDisplayProps} />
    )
  }

  return (
    <ContextMenu
      actions={contextActions}
      onPress={handleContextPress}
      onCancel={handleContextCancel}
      preview={artworkPreviewComponent(artwork)}
      hideShadows={true}
      previewBackgroundColor={!!dark ? color("black100") : color("white100")}
      disabled={!shouldDisplayContextMenu}
    >
      {children}
    </ContextMenu>
  )
}
