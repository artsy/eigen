import { Flex, Spacer } from "@artsy/palette-mobile"
import { ArtworkRailCard_artwork$key } from "__generated__/ArtworkRailCard_artwork.graphql"
import { CreateArtworkAlertModal } from "app/Components/Artist/ArtistArtworks/CreateArtworkAlertModal"
import {
  ARTWORK_RAIL_CARD_IMAGE_HEIGHT,
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
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { ArtworkActionTrackingProps } from "app/utils/track/ArtworkActions"
import { useState } from "react"
import { GestureResponderEvent, PixelRatio, TouchableHighlight } from "react-native"
import { graphql, useFragment } from "react-relay"

export const ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT = PixelRatio.getFontScale() * 100
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

  // 36 = 20 (padding) + 16 (icon size) + 5 (top padding)
  const likeAndFollowCTAPadding =
    showSaveIcon &&
    enableNewSaveAndFollowOnArtworkCard &&
    (enableNewSaveCTA || enableNewSaveAndFollowCTAs)
      ? 41
      : 0
  const artworkRailCardMetaPadding = 10
  const artworkRailCardMetaDataHeight =
    ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT + artworkRailCardMetaPadding + likeAndFollowCTAPadding

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
              height={ARTWORK_RAIL_CARD_IMAGE_HEIGHT + artworkRailCardMetaDataHeight}
              justifyContent="flex-start"
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
                metaContainerStyles={metaContainerStyles}
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
                contextModule={contextModule}
                contextScreen={contextScreen}
                contextScreenOwnerId={contextScreenOwnerId}
                contextScreenOwnerSlug={contextScreenOwnerSlug}
                contextScreenOwnerType={contextScreenOwnerType}
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
    ...ArtworkItemCTAs_artwork
  }
`
