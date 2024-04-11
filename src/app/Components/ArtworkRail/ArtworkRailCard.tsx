import {
  Flex,
  HeartFillIcon,
  HeartIcon,
  Text,
  useColor,
  Touchable,
  useScreenDimensions,
  Image,
} from "@artsy/palette-mobile"
import {
  ArtworkRailCard_artwork$data,
  ArtworkRailCard_artwork$key,
} from "__generated__/ArtworkRailCard_artwork.graphql"
import { CreateArtworkAlertModal } from "app/Components/Artist/ArtistArtworks/CreateArtworkAlertModal"
import { saleMessageOrBidInfo as defaultSaleMessageOrBidInfo } from "app/Components/ArtworkGrids/ArtworkGridItem"
import { useSaveArtworkToArtworkLists } from "app/Components/ArtworkLists/useSaveArtworkToArtworkLists"
import { useExtraLargeWidth } from "app/Components/ArtworkRail/useExtraLargeWidth"
import { ContextMenuArtwork } from "app/Components/ContextMenu/ContextMenuArtwork"
import { AnalyticsContextProvider } from "app/system/analytics/AnalyticsContext"
import { getUrgencyTag } from "app/utils/getUrgencyTag"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import {
  ArtworkActionTrackingProps,
  tracks as artworkActionTracks,
} from "app/utils/track/ArtworkActions"
import { sizeToFit } from "app/utils/useSizeToFit"
import { compact } from "lodash"
import { useMemo, useState } from "react"
import { Dimensions, GestureResponderEvent, PixelRatio, TouchableHighlight } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { LARGE_RAIL_IMAGE_WIDTH } from "./LargeArtworkRail"
import { SMALL_RAIL_IMAGE_WIDTH } from "./SmallArtworkRail"

export const ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT = 70
const SAVE_ICON_SIZE = 26

export const ARTWORK_RAIL_CARD_IMAGE_HEIGHT = {
  small: 230,
  large: 320,
  extraLarge: 400,
  fullWidth: Dimensions.get("window").height,
}

const ARTWORK_LARGE_RAIL_CARD_IMAGE_WIDTH = 295

export type ArtworkCardSize = "small" | "large" | "extraLarge" | "fullWidth"

export interface ArtworkRailCardProps extends ArtworkActionTrackingProps {
  artwork: ArtworkRailCard_artwork$key
  dark?: boolean
  hideArtistName?: boolean
  showPartnerName?: boolean
  isRecentlySoldArtwork?: boolean
  lotLabel?: string | null
  lowEstimateDisplay?: string
  highEstimateDisplay?: string
  metaContainerStyles?: {}
  performanceDisplay?: string
  onPress?: (event: GestureResponderEvent) => void
  onSupressArtwork?: () => void
  priceRealizedDisplay?: string
  showSaveIcon?: boolean
  size: ArtworkCardSize
  testID?: string
}

export const ArtworkRailCard: React.FC<ArtworkRailCardProps> = ({
  hideArtistName = false,
  showPartnerName = false,
  dark = false,
  isRecentlySoldArtwork = false,
  lotLabel,
  lowEstimateDisplay,
  highEstimateDisplay,
  metaContainerStyles,
  performanceDisplay,
  onPress,
  onSupressArtwork,
  priceRealizedDisplay,
  showSaveIcon = false,
  size,
  testID,
  ...restProps
}) => {
  const EXTRALARGE_RAIL_CARD_IMAGE_WIDTH = useExtraLargeWidth()

  const { trackEvent } = useTracking()
  const fontScale = PixelRatio.getFontScale()
  const [showCreateArtworkAlertModal, setShowCreateArtworkAlertModal] = useState(false)
  const artwork = useFragment(artworkFragment, restProps.artwork)
  const { width: screenWidth } = useScreenDimensions()

  const { artistNames, date, image, partner, title, sale, saleArtwork } = artwork

  const saleMessage = defaultSaleMessageOrBidInfo({ artwork, isSmallTile: true })

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

  const getTextHeightByArtworkSize = (cardSize: ArtworkCardSize) => {
    if (cardSize === "small") {
      return ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT + 30
    }
    return ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT + (isRecentlySoldArtwork ? 50 : 0)
  }

  const containerWidth = useMemo(() => {
    const imageDimensions =
      size !== "fullWidth"
        ? sizeToFit(
            {
              width: image?.resized?.width ?? 0,
              height: image?.resized?.height ?? 0,
            },
            {
              width: isRecentlySoldArtwork
                ? EXTRALARGE_RAIL_CARD_IMAGE_WIDTH
                : ARTWORK_LARGE_RAIL_CARD_IMAGE_WIDTH,
              height: ARTWORK_RAIL_CARD_IMAGE_HEIGHT[size],
            }
          )
        : {
            width: screenWidth,
            height: ARTWORK_RAIL_CARD_IMAGE_HEIGHT[size],
          }

    switch (size) {
      case "small":
        return artwork.image?.resized?.width
      case "large":
        if (imageDimensions.width <= SMALL_RAIL_IMAGE_WIDTH) {
          return SMALL_RAIL_IMAGE_WIDTH
        } else if (imageDimensions.width >= LARGE_RAIL_IMAGE_WIDTH) {
          return LARGE_RAIL_IMAGE_WIDTH
        } else {
          return imageDimensions.width
        }
      case "extraLarge":
        if (imageDimensions.width <= SMALL_RAIL_IMAGE_WIDTH) {
          return SMALL_RAIL_IMAGE_WIDTH
        } else if (imageDimensions.width <= LARGE_RAIL_IMAGE_WIDTH) {
          return LARGE_RAIL_IMAGE_WIDTH
        } else if (imageDimensions.width >= EXTRALARGE_RAIL_CARD_IMAGE_WIDTH) {
          return EXTRALARGE_RAIL_CARD_IMAGE_WIDTH
        } else {
          return imageDimensions.width
        }
      case "fullWidth":
        return Dimensions.get("window").width

      default:
        assertNever(size)
        break
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

  const displayForRecentlySoldArtwork =
    !!isRecentlySoldArtwork && (size === "large" || size === "extraLarge")

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
          isRecentlySoldArtwork,
          lotLabel,
          lowEstimateDisplay,
          highEstimateDisplay,
          performanceDisplay,
          priceRealizedDisplay,
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
              size={size}
              urgencyTag={urgencyTag}
              imageHeightExtra={
                displayForRecentlySoldArtwork
                  ? getTextHeightByArtworkSize(size) - ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT
                  : undefined
              }
            />
            <Flex
              my={1}
              width={containerWidth}
              // Recently sold artworks require more space for the text container
              // to accommodate the estimate and realized price
              style={{
                height: fontScale * getTextHeightByArtworkSize(size),
                ...metaContainerStyles,
              }}
              backgroundColor={backgroundColor}
              flexDirection="row"
              justifyContent="space-between"
            >
              <Flex flex={1} backgroundColor={backgroundColor}>
                {!!lotLabel && (
                  <Text lineHeight="20px" color={secondaryTextColor} numberOfLines={1}>
                    Lot {lotLabel}
                  </Text>
                )}
                {!hideArtistName && !!artistNames && (
                  <Text
                    color={primaryTextColor}
                    numberOfLines={size === "small" ? 2 : 1}
                    lineHeight={displayForRecentlySoldArtwork ? undefined : "20px"}
                    variant={displayForRecentlySoldArtwork ? "md" : "xs"}
                  >
                    {artistNames}
                  </Text>
                )}
                {!!title && (
                  <Text
                    lineHeight={displayForRecentlySoldArtwork ? undefined : "20px"}
                    color={displayForRecentlySoldArtwork ? undefined : secondaryTextColor}
                    numberOfLines={size === "small" ? 2 : 1}
                    variant="xs"
                    fontStyle={displayForRecentlySoldArtwork ? undefined : "italic"}
                  >
                    {title}
                    {!!date && (
                      <Text
                        lineHeight={displayForRecentlySoldArtwork ? undefined : "20px"}
                        color={displayForRecentlySoldArtwork ? undefined : secondaryTextColor}
                        numberOfLines={size === "small" ? 2 : 1}
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

                {!!isRecentlySoldArtwork && (size === "large" || size === "extraLarge") && (
                  <RecentlySoldCardSection
                    priceRealizedDisplay={priceRealizedDisplay}
                    lowEstimateDisplay={lowEstimateDisplay}
                    highEstimateDisplay={highEstimateDisplay}
                    performanceDisplay={performanceDisplay}
                    secondaryTextColor={secondaryTextColor}
                  />
                )}

                {!!saleMessage && !isRecentlySoldArtwork && (
                  <Text
                    lineHeight="20px"
                    variant="xs"
                    color={primaryTextColor}
                    numberOfLines={1}
                    fontWeight="bold"
                  >
                    {saleMessage}
                  </Text>
                )}
              </Flex>
              {!!showSaveIcon && (
                <Flex>
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
                        height={SAVE_ICON_SIZE}
                        width={SAVE_ICON_SIZE}
                        fill="blue100"
                      />
                    ) : (
                      <HeartIcon
                        testID="empty-heart-icon"
                        height={SAVE_ICON_SIZE}
                        width={SAVE_ICON_SIZE}
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
  size: ArtworkCardSize
  urgencyTag?: string | null
  containerWidth?: number | null
  isRecentlySoldArtwork?: boolean
  /** imageHeightExtra is an optional padding value you might want to add to image height
   * When using large width like with RecentlySold, image appears cropped
   * TODO: - Investigate why
   */
  imageHeightExtra?: number
}

const ArtworkRailCardImage: React.FC<ArtworkRailCardImageProps> = ({
  image,
  size,
  urgencyTag = null,
  containerWidth,
  isRecentlySoldArtwork,
  imageHeightExtra = 0,
}) => {
  const color = useColor()
  const EXTRALARGE_RAIL_CARD_IMAGE_WIDTH = useExtraLargeWidth()
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
        height={ARTWORK_RAIL_CARD_IMAGE_HEIGHT[size]}
        style={{ borderRadius: 2 }}
      />
    )
  }

  const getContainerDimensions = () => {
    if (isRecentlySoldArtwork) {
      return {
        width: EXTRALARGE_RAIL_CARD_IMAGE_WIDTH,
        height: ARTWORK_RAIL_CARD_IMAGE_HEIGHT[size],
      }
    }

    if (size === "fullWidth") {
      return {
        width: Dimensions.get("screen").width,
        height: ARTWORK_RAIL_CARD_IMAGE_HEIGHT[size],
      }
    }

    return {
      width: ARTWORK_LARGE_RAIL_CARD_IMAGE_WIDTH,
      height: ARTWORK_RAIL_CARD_IMAGE_HEIGHT[size],
    }
  }

  const imageDimensions = sizeToFit(
    {
      width: width ?? 0,
      height: height ?? 0,
    },
    getContainerDimensions()
  )

  const aspectRatio = image?.aspectRatio || imageDimensions.width / imageDimensions.height

  const getImageHeight = () => {
    let adjustedHeight = 0

    if (imageDimensions.height) {
      adjustedHeight = imageDimensions.height + imageHeightExtra
    } else {
      adjustedHeight = ARTWORK_RAIL_CARD_IMAGE_HEIGHT[size]
    }

    if (size !== "fullWidth" || !height) {
      return adjustedHeight
    }

    const MINIMUM_ASPECT_RATIO = 0.2
    const MAXIMUM_ASPECT_RATIO = 0.7

    // Make sure that the image height is not too little or not too big
    // See https://artsy.slack.com/archives/C05EQL4R5N0/p1701167802957189?thread_ts=1701164551.999919&cid=C05EQL4R5N0
    if (aspectRatio < MINIMUM_ASPECT_RATIO) {
      return Dimensions.get("screen").width / MINIMUM_ASPECT_RATIO
    } else if (aspectRatio > MAXIMUM_ASPECT_RATIO) {
      return Dimensions.get("screen").width / aspectRatio
    } else {
      return Dimensions.get("screen").width / aspectRatio
    }
  }

  return (
    <Flex>
      <Flex width={containerWidth}>
        <Image
          src={src}
          width={containerWidth}
          height={getImageHeight()}
          blurhash={showBlurhash ? image?.blurhash : undefined}
        />
      </Flex>

      {!!urgencyTag && (
        <Flex
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

export const RecentlySoldCardSection: React.FC<
  Pick<
    ArtworkRailCardProps,
    "priceRealizedDisplay" | "lowEstimateDisplay" | "highEstimateDisplay" | "performanceDisplay"
  > & { secondaryTextColor: string }
> = ({ priceRealizedDisplay, lowEstimateDisplay, highEstimateDisplay, performanceDisplay }) => {
  return (
    <Flex>
      <Flex flexDirection="row" justifyContent="space-between" mt={1}>
        <Text variant="lg-display" numberOfLines={1}>
          {priceRealizedDisplay}
        </Text>
        {!!performanceDisplay && (
          <Text variant="lg-display" color="green" numberOfLines={1}>
            {`+${performanceDisplay}`}
          </Text>
        )}
      </Flex>
      <Text variant="xs" color="black60" lineHeight="20px">
        Estimate {compact([lowEstimateDisplay, highEstimateDisplay]).join("—")}
      </Text>
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
    ...useSaveArtworkToArtworkLists_artwork
  }
`
