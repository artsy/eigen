import { Flex, Text, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { ContextMenuArtworkPreviewCard_artwork$key } from "__generated__/ContextMenuArtworkPreviewCard_artwork.graphql"
import { useMetaDataTextColor } from "app/Components/ArtworkRail/ArtworkRailUtils"
import { ArtworkDisplayProps } from "app/Components/ContextMenu/ContextMenuArtwork"
import { ContextMenuArtworkPreviewCardImage } from "app/Components/ContextMenu/ContextMenuArtworkPreviewCardImage"
import { saleMessageOrBidInfo } from "app/utils/getSaleMessgeOrBidInfo"
import { PixelRatio } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"

const ARTWORK_PREVIEW_TEXT_CONTAINER_HEIGHT = 70

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

  const { artistNames, date, partner, title } = artwork

  const saleMessage = saleMessageOrBidInfo({ artwork, isSmallTile: true })

  const { primaryColor, secondaryColor, backgroundColor } = useMetaDataTextColor({ dark })

  const getTextHeight = () => {
    return ARTWORK_PREVIEW_TEXT_CONTAINER_HEIGHT
  }

  const containerWidth = FULL_WIDTH_RAIL_CARD_IMAGE_WIDTH

  return (
    <Flex backgroundColor={backgroundColor} m={1}>
      <ContextMenuArtworkPreviewCardImage containerWidth={containerWidth} artwork={artwork} />
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
            <Text lineHeight="20px" color={secondaryColor} numberOfLines={1}>
              Lot {lotLabel}
            </Text>
          )}
          {!hideArtistName && !!artistNames && (
            <Text color={primaryColor} numberOfLines={1} lineHeight="20px" variant="xs">
              {artistNames}
            </Text>
          )}
          {!!title && (
            <Text lineHeight="20px" color={secondaryColor} numberOfLines={1} variant="xs">
              {title}
              {!!date && (
                <Text lineHeight="20px" color={secondaryColor} numberOfLines={1} variant="xs">
                  {title && date ? ", " : ""}
                  {date}
                </Text>
              )}
            </Text>
          )}

          {!!showPartnerName && !!partner?.name && (
            <Text lineHeight="20px" variant="xs" color={secondaryColor} numberOfLines={1}>
              {partner?.name}
            </Text>
          )}
          {SalePriceComponent
            ? SalePriceComponent
            : !!saleMessage && (
                <Text
                  lineHeight="20px"
                  variant="xs"
                  color={primaryColor}
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
    partner(shallow: true) {
      name
    }
  }
`
