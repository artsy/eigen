import {
  Box,
  Flex,
  HeartFillIcon,
  HeartIcon,
  Image,
  Text,
  Touchable,
  useColor,
} from "@artsy/palette-mobile"
import {
  ArtworkRailCard_artwork$data,
  ArtworkRailCard_artwork$key,
} from "__generated__/ArtworkRailCard_artwork.graphql"
import { CreateArtworkAlertModal } from "app/Components/Artist/ArtistArtworks/CreateArtworkAlertModal"
import { ArtworkAuctionTimer } from "app/Components/ArtworkGrids/ArtworkAuctionTimer"
import { ArtworkSocialSignal } from "app/Components/ArtworkGrids/ArtworkSocialSignal"
import { useSaveArtworkToArtworkLists } from "app/Components/ArtworkLists/useSaveArtworkToArtworkLists"
import { ARTWORK_RAIL_IMAGE_WIDTH } from "app/Components/ArtworkRail/ArtworkRail"
import { ContextMenuArtwork } from "app/Components/ContextMenu/ContextMenuArtwork"
import { HEART_ICON_SIZE } from "app/Components/constants"
import { formattedTimeLeft } from "app/Scenes/Activity/utils/formattedTimeLeft"
import { AnalyticsContextProvider } from "app/system/analytics/AnalyticsContext"
import { saleMessageOrBidInfo as defaultSaleMessageOrBidInfo } from "app/utils/getSaleMessgeOrBidInfo"
import { getTimer } from "app/utils/getTimer"
import { getUrgencyTag } from "app/utils/getUrgencyTag"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import {
  ArtworkActionTrackingProps,
  tracks as artworkActionTracks,
} from "app/utils/track/ArtworkActions"
import { sizeToFit } from "app/utils/useSizeToFit"
import { useMemo, useState } from "react"
import { GestureResponderEvent, PixelRatio, TouchableHighlight } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

export const ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT = 90
export const ARTWORK_RAIL_CARD_IMAGE_HEIGHT = 320
const ARTWORK_LARGE_RAIL_CARD_IMAGE_WIDTH = 295

export interface ArtworkRailCardProps extends ArtworkActionTrackingProps {
  artwork: ArtworkRailCard_artwork$key
  dark?: boolean
  hideArtistName?: boolean
  showPartnerName?: boolean
  /**
   * CustomSalePriceComponent is a component that can be passed in to override the default sale price
   */
  CustomSalePriceComponent?: Element
  lotLabel?: string | null
  metaContainerStyles?: {}
  onPress?: (event: GestureResponderEvent) => void
  onSupressArtwork?: () => void
  showSaveIcon?: boolean
  testID?: string
  hideIncreasedInterestSignal?: boolean
  hideCuratorsPickSignal?: boolean
}

export const ArtworkRailCard: React.FC<ArtworkRailCardProps> = ({
  hideArtistName = false,
  showPartnerName = false,
  CustomSalePriceComponent,
  dark = false,
  lotLabel,
  metaContainerStyles,
  onPress,
  onSupressArtwork,
  showSaveIcon = false,
  testID,
  hideIncreasedInterestSignal = false,
  hideCuratorsPickSignal = false,
  ...restProps
}) => {
  const { trackEvent } = useTracking()
  const fontScale = PixelRatio.getFontScale()

  const AREnablePartnerOfferSignals = useFeatureFlag("AREnablePartnerOfferSignals")
  const AREnableAuctionImprovementsSignals = useFeatureFlag("AREnableAuctionImprovementsSignals")
  const AREnableCuratorsPicksAndInterestSignals = useFeatureFlag(
    "AREnableCuratorsPicksAndInterestSignals"
  )

  const [showCreateArtworkAlertModal, setShowCreateArtworkAlertModal] = useState(false)

  const artwork = useFragment(artworkFragment, restProps.artwork)
  const {
    artistNames,
    date,
    image,
    partner,
    title,
    sale,
    saleArtwork,
    isUnlisted,
    collectorSignals,
  } = artwork

  const saleMessage = defaultSaleMessageOrBidInfo({
    artwork,
    isSmallTile: true,
    collectorSignals: AREnablePartnerOfferSignals ? collectorSignals : null,
    auctionSignals: AREnableAuctionImprovementsSignals ? collectorSignals?.auction : null,
  })

  const partnerOfferEndAt = collectorSignals?.partnerOffer?.endAt
    ? formattedTimeLeft(getTimer(collectorSignals.partnerOffer.endAt).time).timerCopy
    : ""
  const extendedBiddingEndAt = saleArtwork?.extendedBiddingEndAt
  const lotEndAt = saleArtwork?.endAt
  const endAt = extendedBiddingEndAt ?? lotEndAt ?? sale?.endAt
  const urgencyTag = sale?.isAuction && !sale?.isClosed ? getUrgencyTag(endAt) : null

  const primaryTextColor = dark ? "white100" : "black100"
  const secondaryTextColor = dark ? "black15" : "black60"
  const backgroundColor = dark ? "black100" : "white100"

  const {
    contextModule,
    contextScreenOwnerType,
    contextScreenOwnerId,
    contextScreenOwnerSlug,
    contextScreen,
  } = restProps

  const containerWidth = useMemo(() => {
    const imageDimensions = sizeToFit(
      {
        width: image?.resized?.width ?? 0,
        height: image?.resized?.height ?? 0,
      },
      {
        width: ARTWORK_LARGE_RAIL_CARD_IMAGE_WIDTH,
        height: ARTWORK_RAIL_CARD_IMAGE_HEIGHT,
      }
    )

    const SMALL_RAIL_IMAGE_WIDTH = 155

    if (imageDimensions.width <= SMALL_RAIL_IMAGE_WIDTH) {
      return SMALL_RAIL_IMAGE_WIDTH
    } else if (imageDimensions.width >= ARTWORK_RAIL_IMAGE_WIDTH) {
      return ARTWORK_RAIL_IMAGE_WIDTH
    } else {
      return imageDimensions.width
    }
  }, [image?.resized?.height, image?.resized?.width])

  const onArtworkSavedOrUnSaved = (saved: boolean) => {
    const { availability, isAcquireable, isBiddable, isInquireable, isOfferable } = artwork
    const params = {
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
    }
    trackEvent(artworkActionTracks.saveOrUnsaveArtwork(saved, params))
  }

  const supressArtwork = () => {
    onSupressArtwork?.()
  }

  const { isSaved, saveArtworkToLists } = useSaveArtworkToArtworkLists({
    artworkFragmentRef: artwork,
    onCompleted: onArtworkSavedOrUnSaved,
  })

  const displayLimitedTimeOfferSignal =
    AREnablePartnerOfferSignals && collectorSignals?.partnerOffer?.isAvailable && !sale?.isAuction

  const displayAuctionSignal = AREnableAuctionImprovementsSignals && sale?.isAuction

  const saleInfoTextColor =
    displayAuctionSignal && collectorSignals?.auction?.liveBiddingStarted
      ? "blue100"
      : primaryTextColor

  const saleInfoTextWeight =
    displayAuctionSignal && collectorSignals?.auction?.liveBiddingStarted ? "normal" : "bold"

  return (
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
          CustomSalePriceComponent,
        }}
      >
        <TouchableHighlight
          underlayColor={backgroundColor}
          activeOpacity={0.8}
          onPress={onPress}
          testID={testID}
        >
          <Flex backgroundColor={backgroundColor}>
            <ArtworkRailCardImage
              containerWidth={containerWidth}
              image={image}
              urgencyTag={!displayAuctionSignal ? urgencyTag : null}
            />
            <Flex
              my={1}
              width={containerWidth}
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
                  !!AREnableCuratorsPicksAndInterestSignals && (
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
                  <Text lineHeight="20px" variant="xs" color={secondaryTextColor} numberOfLines={1}>
                    {partner?.name}
                  </Text>
                )}

                {CustomSalePriceComponent
                  ? CustomSalePriceComponent
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
  )
}

export interface ArtworkRailCardImageProps {
  image: ArtworkRailCard_artwork$data["image"]
  urgencyTag?: string | null
  containerWidth?: number | null
}

const ArtworkRailCardImage: React.FC<ArtworkRailCardImageProps> = ({
  image,
  urgencyTag = null,
  containerWidth,
}) => {
  const color = useColor()
  const showBlurhash = useFeatureFlag("ARShowBlurhashImagePlaceholder")

  if (!containerWidth) {
    return null
  }

  const { width, height, src } = image?.resized || {}

  if (!src) {
    return (
      <Flex
        bg={color("black30")}
        width={width}
        height={ARTWORK_RAIL_CARD_IMAGE_HEIGHT}
        style={{ borderRadius: 2 }}
      />
    )
  }

  const containerDimensions = {
    width: ARTWORK_LARGE_RAIL_CARD_IMAGE_WIDTH,
    height: ARTWORK_RAIL_CARD_IMAGE_HEIGHT,
  }

  const imageDimensions = sizeToFit(
    {
      width: width ?? 0,
      height: height ?? 0,
    },
    containerDimensions
  )

  const imageHeight = imageDimensions.height || ARTWORK_RAIL_CARD_IMAGE_HEIGHT

  return (
    <Flex>
      <Image
        src={src}
        width={containerWidth}
        height={imageHeight}
        blurhash={showBlurhash ? image?.blurhash : undefined}
      />

      {!!urgencyTag && (
        <Flex
          testID="auction-urgency-tag"
          backgroundColor={color("white100")}
          position="absolute"
          px="5px"
          py="3px"
          bottom="5px"
          left="5px"
          borderRadius={2}
          alignSelf="flex-start"
        >
          <Text variant="xs" color={color("black100")} numberOfLines={1}>
            {urgencyTag}
          </Text>
        </Flex>
      )}
    </Flex>
  )
}

const artworkFragment = graphql`
  fragment ArtworkRailCard_artwork on Artwork @argumentDefinitions(width: { type: "Int" }) {
    ...CreateArtworkAlertModal_artwork
    id
    internalID
    availability
    slug
    isAcquireable
    isBiddable
    isInquireable
    isOfferable
    href
    artistNames
    artists(shallow: true) {
      name
    }
    widthCm
    heightCm
    isHangable
    date
    image {
      blurhash
      url(version: "large")
      resized(width: $width) {
        src
        srcSet
        width
        height
      }
      aspectRatio
    }
    isUnlisted
    sale {
      isAuction
      isClosed
      endAt
    }
    saleMessage
    saleArtwork {
      counts {
        bidderPositions
      }
      currentBid {
        display
      }
      endAt
      extendedBiddingEndAt
    }
    partner {
      name
    }
    title
    realizedPrice
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
    ...useSaveArtworkToArtworkLists_artwork
  }
`
