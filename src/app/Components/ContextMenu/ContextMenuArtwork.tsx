import { ActionType, ContextModule, LongPressedArtwork, ScreenOwnerType } from "@artsy/cohesion"
import { Box, Flex, Join, Separator, Text, Touchable, useColor } from "@artsy/palette-mobile"
import { ContextMenuArtworkPreviewCard_artwork$key } from "__generated__/ContextMenuArtworkPreviewCard_artwork.graphql"
import { ContextMenuArtwork_artwork$key } from "__generated__/ContextMenuArtwork_artwork.graphql"
import { ArtworkRailCardProps } from "app/Components/ArtworkRail/ArtworkRailCard"
import { AutoHeightBottomSheet } from "app/Components/BottomSheet/AutoHeightBottomSheet"
import { ContextMenuArtworkPreviewCard } from "app/Components/ContextMenu/ContextMenuArtworkPreviewCard"
import { useShareSheet } from "app/Components/ShareSheet/ShareSheetContext"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { cm2in } from "app/utils/conversions"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { isDislikeArtworksEnabledFor } from "app/utils/isDislikeArtworksEnabledFor"
import { useDislikeArtwork } from "app/utils/mutations/useDislikeArtwork"
import { Schema } from "app/utils/track"
import { useState } from "react"
import { InteractionManager, Platform, SafeAreaView } from "react-native"
import ContextMenu, { ContextMenuAction, ContextMenuProps } from "react-native-context-menu-view"
import { TouchableHighlight } from "react-native-gesture-handler"
import { HapticFeedbackTypes, trigger } from "react-native-haptic-feedback"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface ContextAction extends Omit<ContextMenuAction, "subtitle"> {
  onPress?: () => void
}

export type ArtworkDisplayProps = Pick<
  ArtworkRailCardProps,
  "dark" | "hideArtistName" | "showPartnerName" | "lotLabel" | "SalePriceComponent"
>

interface ContextMenuArtworkProps {
  artwork: ContextMenuArtwork_artwork$key
  onCreateAlertActionPress: () => void
  onSupressArtwork?: () => void
  haptic?: HapticFeedbackTypes | boolean
  artworkDisplayProps?: ArtworkDisplayProps
  contextScreenOwnerType?: ScreenOwnerType
  contextModule?: ContextModule
  hideCreateAlertOnArtworkPreview?: boolean
}

export const ContextMenuArtwork: React.FC<ContextMenuArtworkProps> = ({
  children,
  haptic = true,
  artworkDisplayProps,
  onCreateAlertActionPress,
  onSupressArtwork,
  contextScreenOwnerType,
  contextModule,
  hideCreateAlertOnArtworkPreview,
  ...restProps
}) => {
  const artwork = useFragment(artworkFragment, restProps.artwork)

  const { trackEvent } = useTracking()
  const { showShareSheet } = useShareSheet()
  const enableContextMenuIOS = useFeatureFlag("AREnableArtworkCardContextMenuIOS")
  const enableContextMenuAndroid = useFeatureFlag("AREnableArtworkCardContextMenuAndroid")
  const { submitMutation: dislikeArtworkMutation } = useDislikeArtwork()
  const isIOS = Platform.OS === "ios"
  const color = useColor()

  const dark = artworkDisplayProps?.dark ?? false

  const { title, href, artists, slug, internalID, id, isHangable, image } = artwork

  const enableCreateAlerts = !!artwork.artists?.length
  const enableViewInRoom = LegacyNativeModules.ARCocoaConstantsModule.AREnabled && isHangable
  const enableSupressArtwork = isDislikeArtworksEnabledFor(contextModule)

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
        title: "Not interested",
        systemIcon: "rectangle.slash",
        onPress: () => {
          InteractionManager.runAfterInteractions(() => {
            onSupressArtwork?.()
            dislikeArtworkMutation({ variables: { artworkID: internalID } })
          })
        },
      })
    }

    if (enableCreateAlerts && !hideCreateAlertOnArtworkPreview) {
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

  const artworkPreviewComponent = (artwork: ContextMenuArtworkPreviewCard_artwork$key) => {
    return (
      <ContextMenuArtworkPreviewCard artwork={artwork} artworkDisplayProps={artworkDisplayProps} />
    )
  }

  const [androidVisible, setAndroidVisible] = useState(false)

  if (isIOS && enableContextMenuIOS) {
    return (
      <ContextMenu
        actions={contextActions}
        onPress={handleContextPress}
        onCancel={handleContextCancel}
        preview={artworkPreviewComponent(artwork)}
        hideShadows={true}
        previewBackgroundColor={!!dark ? color("black100") : color("white100")}
      >
        {children}
      </ContextMenu>
    )
  }

  const handleAndroidLongPress = () => {
    setAndroidVisible(true)
  }

  // Fall back to a bottom sheet on Android
  if (!isIOS && enableContextMenuAndroid) {
    return (
      <>
        <TouchableHighlight
          underlayColor={color("white100")}
          activeOpacity={0.8}
          onLongPress={handleAndroidLongPress}
          delayLongPress={1200}
        >
          {children}
        </TouchableHighlight>

        <AutoHeightBottomSheet visible={androidVisible} onDismiss={() => setAndroidVisible(false)}>
          <SafeAreaView>
            <Flex mx={2} my={2}>
              <Flex ml={-1} mb={1}>
                {artworkPreviewComponent(artwork)}
              </Flex>

              <Join separator={<Separator borderColor="black10" my={1} />}>
                {contextActions.map((action, index) => {
                  return (
                    <Touchable
                      key={index}
                      onPress={() => {
                        setAndroidVisible(false)

                        action.onPress?.()
                      }}
                    >
                      <Box>
                        <Text>{action.title}</Text>
                      </Box>
                    </Touchable>
                  )
                })}
              </Join>
            </Flex>
          </SafeAreaView>
        </AutoHeightBottomSheet>
      </>
    )
  }

  return <>{children}</>
}

const artworkFragment = graphql`
  fragment ContextMenuArtwork_artwork on Artwork @argumentDefinitions(width: { type: "Int" }) {
    ...ContextMenuArtworkPreviewCard_artwork @arguments(width: $width)
    ...useSaveArtworkToArtworkLists_artwork

    title
    href
    artistNames
    artists(shallow: true) {
      name
    }
    slug
    internalID
    id
    isHangable
    contextMenuImage: image {
      url(version: ["larger", "large", "medium", "small", "square"])
    }
    image(includeAll: false) {
      url(version: ["larger", "large", "medium", "small", "square"])
    }
    sale {
      isAuction
      isClosed
    }
    heightCm
    widthCm
  }
`
