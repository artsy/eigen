import { useShareSheet } from "app/Components/ShareSheet/ShareSheetContext"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { cm2in } from "app/utils/conversions"
import { useEnableContextMenu } from "app/utils/hooks/useEnableContextMenu"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useSaveArtwork } from "app/utils/mutations/useSaveArtwork"
import { Schema } from "app/utils/track"
import { InteractionManager } from "react-native"
import { useTracking } from "react-tracking"

interface ArtworkItem {
  title: string
  isSaved: boolean
  artists: any
  slug: string
  internalID: string
  href: string
  id: string
  isHangable: boolean
  heightCm: number
  widthCm: number
  image: {
    url: string
  }
}

interface UseArtworkItemContextMenuProps {
  artwork: ArtworkItem
}

export const useArtworkItemContextMenu = ({ artwork }: UseArtworkItemContextMenuProps) => {
  const { title, isSaved, href, artists, slug, internalID, id, isHangable, image } = artwork
  const { showShareSheet } = useShareSheet()
  const { trackEvent } = useTracking()
  const enableInstantVIR = useFeatureFlag("AREnableInstantViewInRoom")
  const enableContextMenu = useEnableContextMenu()

  const shouldDisplayViewInRoom = LegacyNativeModules.ARCocoaConstantsModule.AREnabled && isHangable

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

  if (!enableContextMenu) {
    return undefined
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

    return artworkQuickActions
  }

  return getArtworkQuickActions()
}
