import { Box, Flex, HeartFillIcon, HeartIcon, Text, Touchable } from "@artsy/palette-mobile"
import { ArtworkRailCard_artwork$key } from "__generated__/ArtworkRailCard_artwork.graphql"
import { CreateArtworkAlertModal } from "app/Components/Artist/ArtistArtworks/CreateArtworkAlertModal"
import { ArtworkAuctionTimer } from "app/Components/ArtworkGrids/ArtworkAuctionTimer"
import { ArtworkSocialSignal } from "app/Components/ArtworkGrids/ArtworkSocialSignal"
import { useSaveArtworkToArtworkLists } from "app/Components/ArtworkLists/useSaveArtworkToArtworkLists"
import { ArtworkRailCardImage } from "app/Components/ArtworkRail/ArtworkRailCardImage"
import { LegacyArtworkRailCardImage } from "app/Components/ArtworkRail/LegacyArtworkRailCardImage"
import { ContextMenuArtwork } from "app/Components/ContextMenu/ContextMenuArtwork"
import { Disappearable, DissapearableArtwork } from "app/Components/Disappearable"
import { HEART_ICON_SIZE } from "app/Components/constants"
import { formattedTimeLeft } from "app/Scenes/Activity/utils/formattedTimeLeft"
import { AnalyticsContextProvider } from "app/system/analytics/AnalyticsContext"
import { saleMessageOrBidInfo as defaultSaleMessageOrBidInfo } from "app/utils/getSaleMessgeOrBidInfo"
import { getTimer } from "app/utils/getTimer"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import {
  ArtworkActionTrackingProps,
  tracks as artworkActionTracks,
} from "app/utils/track/ArtworkActions"
import { useState } from "react"
import { GestureResponderEvent, PixelRatio, TouchableHighlight } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

export const ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT = 90

export interface ArtworkRailCardProps extends ArtworkActionTrackingProps {
  artwork: ArtworkRailCard_artwork$key
  dark?: boolean
  hideArtistName?: boolean
  hideIncreasedInterestSignal?: boolean
  hideCuratorsPickSignal?: boolean
  lotLabel?: string | null
  metaContainerStyles?: {}
  onPress?: (event: GestureResponderEvent) => void
  showSaveIcon?: boolean
  showPartnerName?: boolean
  /**
   * Rendered instead of the sale price section if provided.
   */
  SalePriceComponent?:
    | React.ComponentType<any>
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | null
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
  const { trackEvent } = useTracking()
  const fontScale = PixelRatio.getFontScale()

  const enablePartnerOfferSignals = useFeatureFlag("AREnablePartnerOfferSignals")
  const enableAuctionImprovementsSignals = useFeatureFlag("AREnableAuctionImprovementsSignals")
  const enableCuratorsPicksAndInterestSignals = useFeatureFlag(
    "AREnableCuratorsPicksAndInterestSignals"
  )
  const enableArtworkRailRedesignImageAspectRatio = useFeatureFlag(
    "AREnableArtworkRailRedesignImageAspectRatio"
  )

  const [showCreateArtworkAlertModal, setShowCreateArtworkAlertModal] = useState(false)

  const artwork = useFragment(artworkFragment, restProps.artwork)
  const {
    artistNames,
    availability,
    date,
    isAcquireable,
    isBiddable,
    isInquireable,
    isOfferable,
    partner,
    title,
    sale,
    isUnlisted,
    collectorSignals,
  } = artwork

  const saleMessage = defaultSaleMessageOrBidInfo({
    artwork,
    isSmallTile: true,
    collectorSignals: enablePartnerOfferSignals ? collectorSignals : null,
    auctionSignals: enableAuctionImprovementsSignals ? collectorSignals?.auction : null,
  })

  const partnerOfferEndAt = collectorSignals?.partnerOffer?.endAt
    ? formattedTimeLeft(getTimer(collectorSignals.partnerOffer.endAt).time).timerCopy
    : ""

  const primaryTextColor = dark ? "white100" : "black100"
  const secondaryTextColor = dark ? "black15" : "black60"
  const backgroundColor = dark ? "black100" : "white100"

  const onArtworkSavedOrUnSaved = (saved: boolean) => {
    trackEvent(
      artworkActionTracks.saveOrUnsaveArtwork(saved, {
        acquireable: isAcquireable,
        availability,
        biddable: isBiddable,
        context_module: contextModule,
        context_screen: contextScreen,
        context_screen_owner_id: contextScreenOwnerId,
        context_screen_owner_slug: contextScreenOwnerSlug,
        context_screen_owner_type: contextScreenOwnerType,
        inquireable: isInquireable,
        offerable: isOfferable,
      })
    )
  }

  const supressArtwork = () => {
    ;(artwork as DissapearableArtwork)?._disappearable?.disappear()
  }

  const { isSaved, saveArtworkToLists } = useSaveArtworkToArtworkLists({
    artworkFragmentRef: artwork,
    onCompleted: onArtworkSavedOrUnSaved,
  })

  const displayLimitedTimeOfferSignal =
    enablePartnerOfferSignals && collectorSignals?.partnerOffer?.isAvailable && !sale?.isAuction

  const displayAuctionSignal = enableAuctionImprovementsSignals && sale?.isAuction

  const saleInfoTextColor =
    displayAuctionSignal && collectorSignals?.auction?.liveBiddingStarted
      ? "blue100"
      : primaryTextColor

  const saleInfoTextWeight =
    displayAuctionSignal && collectorSignals?.auction?.liveBiddingStarted ? "normal" : "bold"

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
            <Flex backgroundColor={backgroundColor}>
              {enableArtworkRailRedesignImageAspectRatio ? (
                <ArtworkRailCardImage artwork={artwork} />
              ) : (
                <LegacyArtworkRailCardImage artwork={artwork} />
              )}

              <Flex
                my={1}
                style={{
                  height: fontScale * ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT,
                  ...metaContainerStyles,
                }}
                backgroundColor={backgroundColor}
                flexDirection="row"
                justifyContent="space-between"
              >
                <Flex flex={1} backgroundColor={backgroundColor}>
                  {!!displayLimitedTimeOfferSignal && (
                    <Box backgroundColor="blue10" px={0.5} alignSelf="flex-start" borderRadius={3}>
                      <Text lineHeight="20px" variant="xs" color="blue100">
                        Limited-Time Offer
                      </Text>
                    </Box>
                  )}

                  {!sale?.isAuction &&
                    !displayLimitedTimeOfferSignal &&
                    !!collectorSignals &&
                    !!enableCuratorsPicksAndInterestSignals && (
                      <ArtworkSocialSignal
                        collectorSignals={collectorSignals}
                        hideCuratorsPick={hideCuratorsPickSignal}
                        hideIncreasedInterest={hideIncreasedInterestSignal}
                        dark={dark}
                      />
                    )}

                  {!!lotLabel && (
                    <Text lineHeight="20px" color={secondaryTextColor} numberOfLines={1}>
                      Lot {lotLabel}
                    </Text>
                  )}

                  {!hideArtistName && !!artistNames && (
                    <Text color={primaryTextColor} numberOfLines={1} lineHeight="20px" variant="xs">
                      {artistNames}
                    </Text>
                  )}

                  {!!title && (
                    <Text
                      lineHeight="20px"
                      color={secondaryTextColor}
                      numberOfLines={1}
                      variant="xs"
                      fontStyle="italic"
                    >
                      {title}
                      {!!date && (
                        <Text
                          lineHeight="20px"
                          color={secondaryTextColor}
                          numberOfLines={1}
                          variant="xs"
                        >
                          {title && date ? ", " : ""}
                          {date}
                        </Text>
                      )}
                    </Text>
                  )}

                  {!!showPartnerName && !!partner?.name && (
                    <Text
                      lineHeight="20px"
                      variant="xs"
                      color={secondaryTextColor}
                      numberOfLines={1}
                    >
                      {partner?.name}
                    </Text>
                  )}

                  {SalePriceComponent
                    ? SalePriceComponent
                    : !!saleMessage && (
                        <Text
                          lineHeight="20px"
                          variant="xs"
                          color={saleInfoTextColor}
                          numberOfLines={1}
                          fontWeight={saleInfoTextWeight}
                        >
                          {saleMessage}

                          {!!displayLimitedTimeOfferSignal && (
                            <Text
                              lineHeight="20px"
                              variant="xs"
                              fontWeight="normal"
                              color="blue100"
                              numberOfLines={1}
                            >
                              {"  "}
                              Exp. {partnerOfferEndAt}
                            </Text>
                          )}
                        </Text>
                      )}

                  {!!isUnlisted && (
                    <Text
                      lineHeight="20px"
                      variant="xs"
                      color={primaryTextColor}
                      numberOfLines={1}
                      fontWeight="bold"
                    >
                      Exclusive Access
                    </Text>
                  )}

                  {!!displayAuctionSignal && !!collectorSignals && (
                    <ArtworkAuctionTimer collectorSignals={collectorSignals} inRailCard />
                  )}
                </Flex>

                {!!showSaveIcon && (
                  <Flex flexDirection="row" alignItems="flex-start">
                    {!!displayAuctionSignal && !!collectorSignals?.auction?.lotWatcherCount && (
                      <Text lineHeight="20px" variant="xs" numberOfLines={1}>
                        {collectorSignals.auction.lotWatcherCount}
                      </Text>
                    )}

                    <Touchable
                      haptic
                      hitSlop={{ bottom: 5, right: 5, left: 5, top: 5 }}
                      onPress={saveArtworkToLists}
                      testID="save-artwork-icon"
                      underlayColor={backgroundColor}
                    >
                      {isSaved ? (
                        <HeartFillIcon
                          testID="filled-heart-icon"
                          height={HEART_ICON_SIZE}
                          width={HEART_ICON_SIZE}
                          fill="blue100"
                        />
                      ) : (
                        <HeartIcon
                          testID="empty-heart-icon"
                          height={HEART_ICON_SIZE}
                          width={HEART_ICON_SIZE}
                          fill={primaryTextColor}
                        />
                      )}
                    </Touchable>
                  </Flex>
                )}
              </Flex>
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
    availability
    slug
    isAcquireable
    isBiddable
    isInquireable
    isOfferable
    artistNames
    date
    isUnlisted
    realizedPrice
    sale {
      isAuction
      isClosed
      endAt
    }
    saleMessage
    partner {
      name
    }
    title
    collectorSignals {
      primaryLabel
      partnerOffer {
        isAvailable
        endAt
        priceWithDiscount {
          display
        }
      }
      auction {
        lotWatcherCount
        bidCount
        liveBiddingStarted
        lotClosesAt
      }

      ...ArtworkAuctionTimer_collectorSignals
      ...ArtworkSocialSignal_collectorSignals
    }

    ...CreateArtworkAlertModal_artwork
    ...ArtworkRailCardImage_artwork
    ...LegacyArtworkRailCardImage_artwork
    ...ContextMenuArtwork_artwork
    ...useSaveArtworkToArtworkLists_artwork
  }
`
