import { ActionType, ContextModule, LongPressedArtwork, ScreenOwnerType } from "@artsy/cohesion"
import {
  Box,
  Flex,
  Join,
  Separator,
  Text,
  Touchable,
  useColor,
  useSpace,
} from "@artsy/palette-mobile"
import { ContextMenuArtworkPreviewCard_artwork$key } from "__generated__/ContextMenuArtworkPreviewCard_artwork.graphql"
import { ContextMenuArtwork_artwork$key } from "__generated__/ContextMenuArtwork_artwork.graphql"
import { ArtworkRailCardProps } from "app/Components/ArtworkRail/ArtworkRailCard"
import { AutoHeightBottomSheet } from "app/Components/BottomSheet/AutoHeightBottomSheet"
import { ContextMenuArtworkPreviewCard } from "app/Components/ContextMenu/ContextMenuArtworkPreviewCard"
import { useShareSheet } from "app/Components/ShareSheet/ShareSheetContext"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { useCreateAlertTracking } from "app/Scenes/SavedSearchAlert/useCreateAlertTracking"
import { cm2in } from "app/utils/conversions"
import { isDislikeArtworksEnabledFor } from "app/utils/isDislikeArtworksEnabledFor"
import { useDislikeArtwork } from "app/utils/mutations/useDislikeArtwork"
import { Schema } from "app/utils/track"
import { useState } from "react"
import { InteractionManager, Platform } from "react-native"
import { TouchableHighlight } from "react-native-gesture-handler"
import { HapticFeedbackTypes, trigger } from "react-native-haptic-feedback"
import { SafeAreaView } from "react-native-safe-area-context"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import * as ContextMenu from "zeego/context-menu"

interface ContextAction {
  title: string
  systemIcon: string
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
  contextModule?: ContextModule
  contextScreenOwnerType?: ScreenOwnerType
  hideCreateAlertOnArtworkPreview?: boolean
}

export const ContextMenuArtwork: React.FC<React.PropsWithChildren<ContextMenuArtworkProps>> = ({
  children,
  haptic = true,
  artworkDisplayProps,
  onCreateAlertActionPress,
  onSupressArtwork,
  contextModule,
  contextScreenOwnerType,
  hideCreateAlertOnArtworkPreview,
  ...restProps
}) => {
  const artwork = useFragment(artworkFragment, restProps.artwork)

  const { trackEvent } = useTracking()
  const { showShareSheet } = useShareSheet()
  const { submitMutation: dislikeArtworkMutation } = useDislikeArtwork()
  const isIOS = Platform.OS === "ios"
  const color = useColor()

  const dark = artworkDisplayProps?.dark ?? false

  const { title, href, artists, slug, internalID, id, isHangable, image } = artwork

  const enableCreateAlerts = !!artwork.artists?.length
  const enableViewInRoom = LegacyNativeModules.ARCocoaConstantsModule.AREnabled && isHangable
  const enableSupressArtwork = isDislikeArtworksEnabledFor(contextModule)

  const { trackCreateAlertTap } = useCreateAlertTracking({
    contextScreenOwnerType: contextScreenOwnerType ?? ("unknown" as ScreenOwnerType),
    contextScreenOwnerId: artwork.internalID,
    contextScreenOwnerSlug: artwork.slug,
    contextModule: ContextModule.longPressContextMenu,
  })

  const openViewInRoom = () => {
    if (!((artwork.widthCm && artwork.heightCm) || artwork.diameterCm) || image?.url == null) {
      return
    }

    const artworkWidth = (artwork.widthCm || artwork.diameterCm) as number
    const artworkHeight = (artwork.heightCm || artwork.diameterCm) as number
    const heightIn = cm2in(artworkHeight)
    const widthIn = cm2in(artworkWidth)

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
              const imageUrl = artwork.contextMenuImage?.url || artwork.image?.url
              showShareSheet({
                type: "artwork",
                artists: artists,
                slug: slug,
                internalID: internalID,
                title: title,
                href: href,
                images: imageUrl
                  ? [
                      {
                        __typename: "Image" as const,
                        imageURL: imageUrl,
                      },
                    ]
                  : [],
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
            trackCreateAlertTap()
            onCreateAlertActionPress?.()
          })
        },
      })
    }

    return contextMenuActions
  }

  const contextActions = getContextMenuActions()

  const handleItemPress = (onPress?: () => void) => {
    if (haptic) {
      trigger?.(haptic === true ? "impactLight" : haptic)
    }
    onPress?.()
  }

  const artworkPreviewComponent = (
    artwork: ContextMenuArtworkPreviewCard_artwork$key,
    artworkDisplayProps: ArtworkDisplayProps | undefined
  ) => {
    return (
      <ContextMenuArtworkPreviewCard artwork={artwork} artworkDisplayProps={artworkDisplayProps} />
    )
  }

  const space = useSpace()

  const [androidVisible, setAndroidVisible] = useState(false)

  // TODO: Enable in test enrivonment and fix broken tests
  if (isIOS && !__TEST__) {
    return (
      <ContextMenu.Root>
        <ContextMenu.Trigger style={{ padding: space(1) }}>{children}</ContextMenu.Trigger>

        <ContextMenu.Content>
          <ContextMenu.Preview
            backgroundColor={!!dark ? color("mono100") : color("mono0")}
            borderRadius={space(1)}
          >
            {() => artworkPreviewComponent(artwork, artworkDisplayProps)}
          </ContextMenu.Preview>

          {contextActions.map((action, index) => (
            <ContextMenu.Item
              key={`${action.title}-${index}`}
              onSelect={() => handleItemPress(action.onPress)}
            >
              <ContextMenu.ItemIcon
                ios={{
                  name: action.systemIcon,
                }}
              />
              <ContextMenu.ItemTitle>{action.title}</ContextMenu.ItemTitle>
            </ContextMenu.Item>
          ))}
        </ContextMenu.Content>
      </ContextMenu.Root>
    )
  }

  const handleAndroidLongPress = () => {
    if (contextModule && contextScreenOwnerType) {
      trackEvent(
        trackLongPress.longPressedArtwork(contextModule, contextScreenOwnerType, artwork.slug)
      )
    }
    setAndroidVisible(true)
  }

  // Fall back to a bottom sheet on Android
  if (!isIOS) {
    return (
      <>
        <TouchableHighlight
          accessibilityRole="button"
          underlayColor={dark ? color("mono100") : color("mono0")}
          activeOpacity={0.8}
          onLongPress={handleAndroidLongPress}
          delayLongPress={1200} // To avoid the context menu from opening on a (long) normal press on Android.
          onPress={undefined}
          testID="android-context-menu-trigger"
          style={{ padding: space(1) }}
        >
          {children}
        </TouchableHighlight>

        <AutoHeightBottomSheet visible={androidVisible} onDismiss={() => setAndroidVisible(false)}>
          <SafeAreaView>
            <Flex mb={4}>
              <Flex ml={-1} mb={1} justifyContent="center">
                {/* Always show light mode on Android for the bottom sheet */}
                {artworkPreviewComponent(artwork, { ...artworkDisplayProps, dark: false })}
              </Flex>

              <Flex mx={2}>
                <Join separator={<Separator borderColor="mono10" my={1} />}>
                  {contextActions.map((action, index) => {
                    return (
                      <Touchable
                        accessibilityRole="button"
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
    diameterCm
  }
`

export const trackLongPress = {
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
