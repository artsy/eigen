import { Flex, Text, useColor, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { ArtworkGridItem_artwork$data } from "__generated__/ArtworkGridItem_artwork.graphql"
import { ArtworkRailCard_artwork$data } from "__generated__/ArtworkRailCard_artwork.graphql"
import { RecentlySoldCardSection } from "app/Components/ArtworkRail/ArtworkRailCard"
import { ArtworkDisplayProps } from "app/Components/ContextMenu/ContextMenuArtwork"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import { saleMessageOrBidInfo as defaultSaleMessageOrBidInfo } from "app/utils/getSaleMessgeOrBidInfo"
import { getUrgencyTag } from "app/utils/getUrgencyTag"
import { sizeToFit } from "app/utils/useSizeToFit"
import { PixelRatio } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql } from "react-relay"

const ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT = 70

const ARTWORK_RAIL_CARD_IMAGE_HEIGHT = 400

const ARTWORK_LARGE_RAIL_CARD_IMAGE_WIDTH = 295

const useFullWidth = () => {
  const space = useSpace()
  const { width } = useScreenDimensions()
  const extraLargeWidth = isTablet() ? 400 : width - space(4)
  return extraLargeWidth
}

export interface ContextMenuArtworkPreviewCardProps {
  artwork: ArtworkRailCard_artwork$data | ArtworkGridItem_artwork$data
  artworkDisplayProps?: ArtworkDisplayProps
}

export const ContextMenuArtworkPreviewCard: React.FC<ContextMenuArtworkPreviewCardProps> = ({
  artwork,
  artworkDisplayProps,
}) => {
  const {
    dark = false,
    hideArtistName = false,
    showPartnerName = true,
    displayRealizedPrice = false,
    lotLabel,
    lowEstimateDisplay,
    highEstimateDisplay,
    performanceDisplay,
    priceRealizedDisplay,
  } = artworkDisplayProps ?? {}

  const FULL_WIDTH_RAIL_CARD_IMAGE_WIDTH = useFullWidth()

  const fontScale = PixelRatio.getFontScale()

  const { artistNames, date, image, partner, title, sale, saleArtwork } = artwork

  const saleMessage = defaultSaleMessageOrBidInfo({ artwork, isSmallTile: true })

  const extendedBiddingEndAt = saleArtwork?.extendedBiddingEndAt
  const lotEndAt = saleArtwork?.endAt
  const endAt = extendedBiddingEndAt ?? lotEndAt ?? sale?.endAt
  const urgencyTag = sale?.isAuction && !sale?.isClosed ? getUrgencyTag(endAt) : null

  const primaryTextColor = dark ? "white100" : "black100"
  const secondaryTextColor = dark ? "black15" : "black60"
  const backgroundColor = dark ? "black100" : "white100"

  const getTextHeight = () => {
    return ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT
  }

  const containerWidth = FULL_WIDTH_RAIL_CARD_IMAGE_WIDTH

  return (
    <Flex backgroundColor={backgroundColor} m={1}>
      <ContextMenuArtworkPreviewCardImage
        containerWidth={containerWidth}
        image={image}
        urgencyTag={urgencyTag}
      />
      <Flex
        my={1}
        width={containerWidth}
        // Recently sold artworks require more space for the text container
        // to accommodate the estimate and realized price
        style={{
          height: fontScale * getTextHeight(),
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
                <Text lineHeight="20px" color={secondaryTextColor} numberOfLines={1} variant="xs">
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
          {!!displayRealizedPrice && (
            <RecentlySoldCardSection
              priceRealizedDisplay={priceRealizedDisplay}
              lowEstimateDisplay={lowEstimateDisplay}
              highEstimateDisplay={highEstimateDisplay}
              performanceDisplay={performanceDisplay}
              secondaryTextColor={secondaryTextColor}
            />
          )}

          {!!saleMessage && !displayRealizedPrice && (
            <Text
              lineHeight="20px"
              variant="xs"
              color={primaryTextColor}
              numberOfLines={1}
              fontWeight={500}
            >
              {saleMessage}
            </Text>
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}

export interface ContextMenuArtworkPreviewCardImageProps {
  image: ArtworkRailCard_artwork$data["image"]
  urgencyTag?: string | null
  containerWidth?: number
  displayRealizedPrice?: boolean
  /** imageHeightExtra is an optional padding value you might want to add to image height
   * When using large width like with RecentlySold, image appears cropped
   * TODO: - Investigate why
   */
  imageHeightExtra?: number
}

export const ContextMenuArtworkPreviewCardImage: React.FC<
  ContextMenuArtworkPreviewCardImageProps
> = ({ image, urgencyTag = null, containerWidth, displayRealizedPrice, imageHeightExtra = 0 }) => {
  const color = useColor()
  const FULL_WIDTH_RAIL_CARD_IMAGE_WIDTH = useFullWidth()

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

  const imageDimensions = sizeToFit(
    {
      width: width ?? 0,
      height: height ?? 0,
    },
    {
      width: displayRealizedPrice
        ? FULL_WIDTH_RAIL_CARD_IMAGE_WIDTH
        : ARTWORK_LARGE_RAIL_CARD_IMAGE_WIDTH,
      height: ARTWORK_RAIL_CARD_IMAGE_HEIGHT,
    }
  )

  return (
    <Flex>
      <Flex width={containerWidth}>
        <OpaqueImageView
          style={{ maxHeight: ARTWORK_RAIL_CARD_IMAGE_HEIGHT }}
          imageURL={src}
          height={
            imageDimensions.height
              ? imageDimensions.height + imageHeightExtra
              : ARTWORK_RAIL_CARD_IMAGE_HEIGHT
          }
          width={containerWidth}
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

export const artworkFragment = graphql`
  fragment ContextMenuArtworkPreviewCard_artwork on Artwork
  @argumentDefinitions(width: { type: "Int" }) {
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
