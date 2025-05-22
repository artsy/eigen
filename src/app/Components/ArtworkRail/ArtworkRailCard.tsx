import { Box, Flex, Spacer } from "@artsy/palette-mobile"
import { ArtworkRailCard_artwork$key } from "__generated__/ArtworkRailCard_artwork.graphql"
import { CreateArtworkAlertModal } from "app/Components/Artist/ArtistArtworks/CreateArtworkAlertModal"
import {
  ARTWORK_RAIL_CARD_MAX_WIDTH,
  ARTWORK_RAIL_CARD_MIN_WIDTH,
  ArtworkRailCardImage,
} from "app/Components/ArtworkRail/ArtworkRailCardImage"
import {
  ArtworkRailCardCommonProps,
  ArtworkRailCardMeta,
} from "app/Components/ArtworkRail/ArtworkRailCardMeta"
import { ContextMenuArtwork, trackLongPress } from "app/Components/ContextMenu/ContextMenuArtwork"
import { Disappearable } from "app/Components/Disappearable"
import { AnalyticsContextProvider } from "app/system/analytics/AnalyticsContext"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { ArtworkActionTrackingProps } from "app/utils/track/ArtworkActions"
import { useRef, useState } from "react"
import { GestureResponderEvent, PixelRatio, Platform } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

const fontScale = PixelRatio.getFontScale()
export const ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT = fontScale * 100

export interface ArtworkRailCardProps
  extends ArtworkActionTrackingProps,
    ArtworkRailCardCommonProps {
  artwork: ArtworkRailCard_artwork$key
  href?: string | null
  onPress?: (event: GestureResponderEvent) => void
  testID?: string
}

export const ArtworkRailCard: React.FC<ArtworkRailCardProps> = ({
  contextModule,
  contextScreenOwnerType,
  contextScreenOwnerId,
  contextScreenOwnerSlug,
  contextScreen,
  dark = false,
  href,
  hideArtistName = false,
  hideIncreasedInterestSignal = false,
  hideCuratorsPickSignal = false,
  lotLabel,
  showPartnerName = false,
  containerHeight,
  onPress,
  SalePriceComponent,
  showSaveIcon = false,
  testID,
  ...restProps
}) => {
  const enableContextMenuIOS = useFeatureFlag("AREnableArtworkCardContextMenuIOS")
  const isIOS = Platform.OS === "ios"

  const { trackEvent } = useTracking()

  const [showCreateArtworkAlertModal, setShowCreateArtworkAlertModal] = useState(false)
  const disappearableRef = useRef<Disappearable>(null)

  const artwork = useFragment(artworkFragment, restProps.artwork)

  const backgroundColor = dark ? "mono100" : "mono0"

  const supressArtwork = () => {
    disappearableRef.current?.disappear()
  }

  return (
    <Disappearable ref={disappearableRef}>
      <AnalyticsContextProvider
        contextScreenOwnerId={contextScreenOwnerId}
        contextScreenOwnerSlug={contextScreenOwnerSlug}
        contextScreenOwnerType={contextScreenOwnerType}
      >
        <Box pr={2}>
          <RouterLink
            to={href || artwork.href}
            underlayColor={backgroundColor}
            onPress={onPress}
            // To prevent navigation when opening the long-press context menu, `onLongPress` & `delayLongPress` need to be set (https://github.com/mpiannucci/react-native-context-menu-view/issues/60)
            onLongPress={() => {
              // Android long press is tracked inside of the ContextMenuArtwork component
              if (contextModule && contextScreenOwnerType && isIOS && enableContextMenuIOS) {
                trackEvent(
                  trackLongPress.longPressedArtwork(
                    contextModule,
                    contextScreenOwnerType,
                    artwork.slug
                  )
                )
              }
            }}
            delayLongPress={400}
            testID={testID}
          >
            <ContextMenuArtwork
              contextModule={contextModule}
              contextScreenOwnerType={contextScreenOwnerType}
              onCreateAlertActionPress={() => setShowCreateArtworkAlertModal(true)}
              onSupressArtwork={supressArtwork}
              artwork={artwork}
              artworkDisplayProps={{
                dark,
                showPartnerName,
                hideArtistName,
                lotLabel,
                SalePriceComponent,
              }}
            >
              <Flex
                height={containerHeight ?? "auto"}
                justifyContent="flex-start"
                minWidth={ARTWORK_RAIL_CARD_MIN_WIDTH}
                maxWidth={ARTWORK_RAIL_CARD_MAX_WIDTH}
              >
                <ArtworkRailCardImage artwork={artwork} />

                <Spacer y={1} />

                <ArtworkRailCardMeta
                  artwork={artwork}
                  contextModule={contextModule}
                  contextScreen={contextScreen}
                  contextScreenOwnerId={contextScreenOwnerId}
                  contextScreenOwnerSlug={contextScreenOwnerSlug}
                  contextScreenOwnerType={contextScreenOwnerType}
                  dark={dark}
                  hideArtistName={hideArtistName}
                  hideCuratorsPickSignal={hideCuratorsPickSignal}
                  hideIncreasedInterestSignal={hideIncreasedInterestSignal}
                  lotLabel={lotLabel}
                  SalePriceComponent={SalePriceComponent}
                  showPartnerName={showPartnerName}
                  showSaveIcon={showSaveIcon}
                  backgroundColor={backgroundColor}
                />
              </Flex>
            </ContextMenuArtwork>
          </RouterLink>
        </Box>

        <CreateArtworkAlertModal
          artwork={artwork}
          onClose={() => setShowCreateArtworkAlertModal(false)}
          visible={showCreateArtworkAlertModal}
        />
      </AnalyticsContextProvider>
    </Disappearable>
  )
}

const artworkFragment = graphql`
  fragment ArtworkRailCard_artwork on Artwork {
    href
    internalID
    slug
    ...ArtworkRailCardImage_artwork
    ...ArtworkRailCardMeta_artwork
    ...ContextMenuArtwork_artwork
    ...CreateArtworkAlertModal_artwork
  }
`
