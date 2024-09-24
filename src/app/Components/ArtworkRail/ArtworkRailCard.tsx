import { Flex } from "@artsy/palette-mobile"
import { ArtworkRailCard_artwork$key } from "__generated__/ArtworkRailCard_artwork.graphql"
import { CreateArtworkAlertModal } from "app/Components/Artist/ArtistArtworks/CreateArtworkAlertModal"
import { ArtworkRailCardImage } from "app/Components/ArtworkRail/ArtworkRailCardImage"
import {
  ArtworkRailCardCommonProps,
  ArtworkRailCardMeta,
} from "app/Components/ArtworkRail/ArtworkRailCardMeta"
import {
  ARTWORK_RAIL_CARD_IMAGE_HEIGHT,
  LegacyArtworkRailCardImage,
} from "app/Components/ArtworkRail/LegacyArtworkRailCardImage"
import { ContextMenuArtwork } from "app/Components/ContextMenu/ContextMenuArtwork"
import { Disappearable, DissapearableArtwork } from "app/Components/Disappearable"
import { AnalyticsContextProvider } from "app/system/analytics/AnalyticsContext"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { ArtworkActionTrackingProps } from "app/utils/track/ArtworkActions"
import { useState } from "react"
import { GestureResponderEvent, PixelRatio, TouchableHighlight } from "react-native"
import { graphql, useFragment } from "react-relay"

export const ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT = PixelRatio.getFontScale() * 90
export const ARTWORK_RAIL_CARD_MINIMUM_WIDTH = 140

export interface ArtworkRailCardProps
  extends ArtworkActionTrackingProps,
    ArtworkRailCardCommonProps {
  artwork: ArtworkRailCard_artwork$key
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
  hideArtistName = false,
  hideIncreasedInterestSignal = false,
  hideCuratorsPickSignal = false,
  lotLabel,
  showPartnerName = false,
  metaContainerStyles,
  onPress,
  SalePriceComponent,
  showSaveIcon = false,
  testID,
  ...restProps
}) => {
  const enableArtworkRailRedesignImageAspectRatio = useFeatureFlag(
    "AREnableArtworkRailRedesignImageAspectRatio"
  )

  const [showCreateArtworkAlertModal, setShowCreateArtworkAlertModal] = useState(false)

  const artwork = useFragment(artworkFragment, restProps.artwork)

  const backgroundColor = dark ? "black100" : "white100"

  const supressArtwork = () => {
    ;(artwork as DissapearableArtwork)?._disappearable?.disappear()
  }

  return (
    <Disappearable ref={(ref) => ((artwork as DissapearableArtwork)._disappearable = ref)}>
      <AnalyticsContextProvider
        contextScreenOwnerId={contextScreenOwnerId}
        contextScreenOwnerSlug={contextScreenOwnerSlug}
        contextScreenOwnerType={contextScreenOwnerType}
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
          <TouchableHighlight
            underlayColor={backgroundColor}
            activeOpacity={0.8}
            onPress={onPress}
            testID={testID}
          >
            <Flex
              height={ARTWORK_RAIL_CARD_IMAGE_HEIGHT + ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT}
              justifyContent="flex-end"
            >
              {enableArtworkRailRedesignImageAspectRatio ? (
                <ArtworkRailCardImage artwork={artwork} />
              ) : (
                <LegacyArtworkRailCardImage artwork={artwork} />
              )}

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
                metaContainerStyles={metaContainerStyles}
                SalePriceComponent={SalePriceComponent}
                showPartnerName={showPartnerName}
                showSaveIcon={showSaveIcon}
                backgroundColor={backgroundColor}
              />
            </Flex>
          </TouchableHighlight>
        </ContextMenuArtwork>

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
    internalID
    slug
    ...ArtworkRailCardImage_artwork
    ...ArtworkRailCardMeta_artwork
    ...ContextMenuArtwork_artwork
    ...CreateArtworkAlertModal_artwork
    ...LegacyArtworkRailCardImage_artwork
  }
`
