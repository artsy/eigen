import { Flex, Text, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { ContextMenuArtworkPreviewCard_artwork$key } from "__generated__/ContextMenuArtworkPreviewCard_artwork.graphql"
import { ArtworkDisplayProps } from "app/Components/ContextMenu/ContextMenuArtwork"
import { ContextMenuArtworkPreviewCardImage } from "app/Components/ContextMenu/ContextMenuArtworkPreviewCardImage"
import { saleMessageOrBidInfo as defaultSaleMessageOrBidInfo } from "app/utils/getSaleMessgeOrBidInfo"
import { getUrgencyTag } from "app/utils/getUrgencyTag"
import { PixelRatio } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"

const ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT = 70

const useFullWidth = () => {
  const space = useSpace()
  const { width } = useScreenDimensions()
  const extraLargeWidth = isTablet() ? 400 : width - space(4)
  return extraLargeWidth
}

export interface ContextMenuArtworkPreviewCardProps {
  artwork: ContextMenuArtworkPreviewCard_artwork$key
  artworkDisplayProps?: ArtworkDisplayProps
}

export const ContextMenuArtworkPreviewCard: React.FC<ContextMenuArtworkPreviewCardProps> = ({
  artworkDisplayProps,
  ...restProps
}) => {
  const artwork = useFragment(artworkFragment, restProps.artwork)

  const {
    SalePriceComponent,
    dark = false,
    hideArtistName = false,
    showPartnerName = true,
    lotLabel,
  } = artworkDisplayProps ?? {}

  const FULL_WIDTH_RAIL_CARD_IMAGE_WIDTH = useFullWidth()

  const fontScale = PixelRatio.getFontScale()

  const { artistNames, date, partner, title, sale, saleArtwork } = artwork

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
        artwork={artwork}
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
          {SalePriceComponent
            ? SalePriceComponent
            : !!saleMessage && (
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

const artworkFragment = graphql`
  fragment ContextMenuArtworkPreviewCard_artwork on Artwork
  @argumentDefinitions(width: { type: "Int" }) {
    ...ContextMenuArtworkPreviewCardImage_artwork @arguments(width: $width)

    artistNames
    date
    title
    realizedPrice
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
  }
`
