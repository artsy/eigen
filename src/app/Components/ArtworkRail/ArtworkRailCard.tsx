import { Box, Flex, Spacer } from "@artsy/palette-mobile"
import { ArtworkRailCard_artwork$key } from "__generated__/ArtworkRailCard_artwork.graphql"
import { CreateArtworkAlertModal } from "app/Components/Artist/ArtistArtworks/CreateArtworkAlertModal"
import {
  ARTWORK_RAIL_CARD_IMAGE_HEIGHT,
  ARTWORK_RAIL_CARD_MAX_WIDTH,
  ARTWORK_RAIL_CARD_MIN_WIDTH,
  ArtworkRailCardImage,
} from "app/Components/ArtworkRail/ArtworkRailCardImage"
import {
  ArtworkRailCardCommonProps,
  ArtworkRailCardMeta,
} from "app/Components/ArtworkRail/ArtworkRailCardMeta"
import { ContextMenuArtwork } from "app/Components/ContextMenu/ContextMenuArtwork"
import { Disappearable, DissapearableArtwork } from "app/Components/Disappearable"
import { ArtworkItemCTAs } from "app/Scenes/Artwork/Components/ArtworkItemCTAs"
import { useGetNewSaveAndFollowOnArtworkCardExperimentVariant } from "app/Scenes/Artwork/utils/useGetNewSaveAndFollowOnArtworkCardExperimentVariant"
import { AnalyticsContextProvider } from "app/system/analytics/AnalyticsContext"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { ArtworkActionTrackingProps } from "app/utils/track/ArtworkActions"
import { useState } from "react"
import { GestureResponderEvent, PixelRatio } from "react-native"
import { graphql, useFragment } from "react-relay"

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
  const enableNewSaveAndFollowOnArtworkCard = useFeatureFlag(
    "AREnableNewSaveAndFollowOnArtworkCard"
  )

  const { enableNewSaveCTA, enableNewSaveAndFollowCTAs } =
    useGetNewSaveAndFollowOnArtworkCardExperimentVariant(
      "onyx_artwork-card-save-and-follow-cta-redesign"
    )

  const [showCreateArtworkAlertModal, setShowCreateArtworkAlertModal] = useState(false)

  const artwork = useFragment(artworkFragment, restProps.artwork)

  const backgroundColor = dark ? "black100" : "white100"

  const supressArtwork = () => {
    ;(artwork as DissapearableArtwork)?._disappearable?.disappear()
  }

  // 36 = 20 (padding) + 18 (icon size) + 5 (top padding) + 2 (border radius when dark background)
  const likeAndFollowCTAPadding =
    showSaveIcon &&
    enableNewSaveAndFollowOnArtworkCard &&
    (enableNewSaveCTA || enableNewSaveAndFollowCTAs)
      ? fontScale * (43 + (dark ? 2 : 0))
      : 0
  const artworkRailCardMetaPadding = fontScale * 10
  const artworkRailCardMetaDataHeight =
    ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT + artworkRailCardMetaPadding + likeAndFollowCTAPadding

  return (
    <Disappearable ref={(ref) => ((artwork as DissapearableArtwork)._disappearable = ref)}>
      <AnalyticsContextProvider
        contextScreenOwnerId={contextScreenOwnerId}
        contextScreenOwnerSlug={contextScreenOwnerSlug}
        contextScreenOwnerType={contextScreenOwnerType}
      >
        <Box pr={2}>
          <RouterLink
            to={href || artwork.href}
            underlayColor={backgroundColor}
            activeOpacity={0.8}
            onPress={onPress}
            // To prevent navigation when opening the long-press context menu, `onLongPress` & `delayLongPress` need to be set (https://github.com/mpiannucci/react-native-context-menu-view/issues/60)
            onLongPress={() => {}}
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
                height={
                  containerHeight ?? ARTWORK_RAIL_CARD_IMAGE_HEIGHT + artworkRailCardMetaDataHeight
                }
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

                {!!enableNewSaveAndFollowOnArtworkCard &&
                  !!(enableNewSaveCTA || enableNewSaveAndFollowCTAs) && <Spacer y={0.5} />}

                <ArtworkItemCTAs
                  artwork={artwork}
                  showSaveIcon={showSaveIcon}
                  dark={dark}
                  contextModule={contextModule}
                  contextScreen={contextScreen}
                  contextScreenOwnerId={contextScreenOwnerId}
                  contextScreenOwnerSlug={contextScreenOwnerSlug}
                  contextScreenOwnerType={contextScreenOwnerType}
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
    ...ArtworkItemCTAs_artwork
  }
`
