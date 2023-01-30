import { themeGet } from "@styled-system/theme-get"
import {
  ArtworkRailCard_artwork$data,
  ArtworkRailCard_artwork$key,
} from "__generated__/ArtworkRailCard_artwork.graphql"
import { saleMessageOrBidInfo as defaultSaleMessageOrBidInfo } from "app/Components/ArtworkGrids/ArtworkGridItem"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { getUrgencyTag } from "app/utils/getUrgencyTag"
import { refreshFavoriteArtworks } from "app/utils/refreshHelpers"
import { Schema } from "app/utils/track"
import { compact } from "lodash"
import { Flex, HeartFillIcon, HeartIcon, Spacer, Text, Touchable, useColor } from "palette"
import { useMemo } from "react"
import { GestureResponderEvent, PixelRatio } from "react-native"
import { graphql, useFragment, useMutation } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { LARGE_RAIL_IMAGE_WIDTH } from "./LargeArtworkRail"
import { SMALL_RAIL_IMAGE_WIDTH } from "./SmallArtworkRail"

export const ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT = 60
const SAVE_ICON_SIZE = 26

export const ARTWORK_RAIL_CARD_IMAGE_HEIGHT = {
  small: 230,
  large: 320,
}

export type ArtworkCardSize = "small" | "large"

export interface ArtworkRailCardProps {
  artwork: ArtworkRailCard_artwork$key
  hideArtistName?: boolean
  hidePartnerName?: boolean
  isRecentlySoldArtwork?: boolean
  lotLabel?: string | null
  lowEstimateDisplay?: string
  highEstimateDisplay?: string
  onPress?: (event: GestureResponderEvent) => void
  priceRealizedDisplay?: string
  showSaveIcon?: boolean
  size: ArtworkCardSize
  testID?: string
  trackingContextScreenOwnerType?: Schema.OwnerEntityTypes
}

export const ArtworkRailCard: React.FC<ArtworkRailCardProps> = ({
  hideArtistName = false,
  hidePartnerName = false,
  isRecentlySoldArtwork = false,
  lotLabel,
  lowEstimateDisplay,
  highEstimateDisplay,
  onPress,
  priceRealizedDisplay,
  showSaveIcon = false,
  size,
  testID,
  trackingContextScreenOwnerType,
  ...restProps
}) => {
  const { trackEvent } = useTracking()
  const fontScale = PixelRatio.getFontScale()
  const [saveArtwork] = useMutation(SaveArtworkMutation)
  const artwork = useFragment(artworkFragment, restProps.artwork)

  const { artistNames, date, id, image, internalID, isSaved, partner, slug, title } = artwork

  const saleMessage = defaultSaleMessageOrBidInfo({ artwork, isSmallTile: true })

  const urgencyTag =
    artwork?.sale?.isAuction && !artwork?.sale?.isClosed
      ? getUrgencyTag(artwork?.sale?.endAt)
      : null

  const getTextHeightByArtworkSize = (cardSize: ArtworkCardSize) => {
    if (cardSize === "small") {
      return ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT + 30
    }
    return ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT + (isRecentlySoldArtwork ? 30 : 0)
  }

  const containerWidth = useMemo(() => {
    const imageDimensions = getImageDimensions({
      width: image?.resized?.width ?? 0,
      height: image?.resized?.height ?? 0,
      maxHeight: ARTWORK_RAIL_CARD_IMAGE_HEIGHT[size],
    })

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

      default:
        assertNever(size)
        break
    }
  }, [image?.resized?.height, image?.resized?.width])

  const handleArtworkSave = () => {
    saveArtwork({
      variables: {
        input: {
          artworkID: internalID,
          remove: isSaved,
        },
      },
      optimisticResponse: {
        saveArtwork: {
          artwork: {
            id,
            isSaved: !isSaved,
          },
        },
      },
      onCompleted: () => {
        refreshFavoriteArtworks()
      },
      onError: () => {
        refreshFavoriteArtworks()
      },
    })

    trackEvent(tracks.saveOrUnsave(isSaved, internalID, slug, trackingContextScreenOwnerType))
  }

  return (
    <ArtworkCard onPress={onPress || undefined} testID={testID}>
      <Flex>
        <ArtworkRailCardImage
          containerWidth={containerWidth}
          image={image}
          size={size}
          urgencyTag={urgencyTag}
        />
        <Flex
          my={1}
          width={containerWidth}
          // Recently sold artworks require more space for the text container
          // to accommodate the estimate and realized price
          style={{
            height: fontScale * getTextHeightByArtworkSize(size),
          }}
          flexDirection="row"
          justifyContent="space-between"
        >
          <Flex flex={1}>
            {!!lotLabel && (
              <Text lineHeight="20" color="black60" numberOfLines={1}>
                Lot {lotLabel}
              </Text>
            )}
            {!hideArtistName && !!artistNames && (
              <Text numberOfLines={size === "small" ? 2 : 1} lineHeight="20" variant="xs">
                {artistNames}
              </Text>
            )}
            {!!title && (
              <Text
                lineHeight="20"
                color="black60"
                numberOfLines={size === "small" ? 2 : 1}
                variant="xs"
                fontStyle="italic"
              >
                {title}
                {!!date && (
                  <Text
                    lineHeight="20"
                    color="black60"
                    numberOfLines={size === "small" ? 2 : 1}
                    variant="xs"
                  >
                    {title && date ? ", " : ""}
                    {date}
                  </Text>
                )}
              </Text>
            )}

            {!hidePartnerName && !!partner?.name && (
              <Text lineHeight="20" color="black60" numberOfLines={1}>
                {partner?.name}
              </Text>
            )}
            {!!isRecentlySoldArtwork && size === "large" && (
              <>
                <Spacer mt={2} />
                <Flex flexDirection="row" justifyContent="space-between">
                  <Text variant="xs" color="black60" numberOfLines={1} fontWeight="500">
                    Estimate
                  </Text>
                  <Text variant="xs" color="black60" numberOfLines={1} fontWeight="500">
                    {compact([lowEstimateDisplay, highEstimateDisplay]).join("—")}
                  </Text>
                </Flex>
                <Flex flexDirection="row" justifyContent="space-between">
                  <Text variant="xs" color="blue100" numberOfLines={1} fontWeight="500">
                    Sold For (incl. premium)
                  </Text>
                  <Text variant="xs" color="blue100" numberOfLines={1} fontWeight="500">
                    {priceRealizedDisplay}
                  </Text>
                </Flex>
              </>
            )}

            {!!saleMessage && !isRecentlySoldArtwork && (
              <Text
                lineHeight="20"
                variant="xs"
                color="black100"
                numberOfLines={1}
                fontWeight={500}
              >
                {saleMessage}
              </Text>
            )}
          </Flex>
          {!!showSaveIcon && (
            <Flex ml={0.2}>
              <Touchable
                haptic
                hitSlop={{ bottom: 5, right: 5, left: 5, top: 5 }}
                onPress={handleArtworkSave}
                testID="save-artwork-icon"
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
                  />
                )}
              </Touchable>
            </Flex>
          )}
        </Flex>
      </Flex>
    </ArtworkCard>
  )
}

export interface ArtworkRailCardImageProps {
  image: ArtworkRailCard_artwork$data["image"]
  size: ArtworkCardSize
  urgencyTag?: string | null
  containerWidth?: number | null
}

const ArtworkRailCardImage: React.FC<ArtworkRailCardImageProps> = ({
  image,
  size,
  urgencyTag = null,
  containerWidth,
}) => {
  const color = useColor()

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

  const imageDimensions = getImageDimensions({
    width: width ?? 0,
    height: height ?? 0,
    maxHeight: ARTWORK_RAIL_CARD_IMAGE_HEIGHT[size],
  })

  return (
    <Flex>
      <Flex width={containerWidth}>
        <OpaqueImageView
          style={{ maxHeight: ARTWORK_RAIL_CARD_IMAGE_HEIGHT[size] }}
          imageURL={src}
          height={imageDimensions.height || ARTWORK_RAIL_CARD_IMAGE_HEIGHT[size]}
          width={containerWidth!}
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

const getImageDimensions = ({
  height,
  width,
  maxHeight,
}: {
  height: number
  width: number
  maxHeight: number
}) => {
  const aspectRatio = width / height
  if (height > maxHeight) {
    const maxWidth = maxHeight * aspectRatio
    return { width: maxWidth, height: maxHeight }
  }
  return { width, height }
}

const SaveArtworkMutation = graphql`
  mutation ArtworkRailCardSaveArtworkMutation($input: SaveArtworkInput!) {
    saveArtwork(input: $input) {
      artwork {
        id
        isSaved
      }
    }
  }
`

const artworkFragment = graphql`
  fragment ArtworkRailCard_artwork on Artwork @argumentDefinitions(width: { type: "Int" }) {
    id
    slug
    internalID
    href
    artistNames
    date
    image {
      resized(width: $width) {
        src
        srcSet
        width
        height
      }
      aspectRatio
    }
    isSaved
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
    }
    partner {
      name
    }
    title
    realizedPrice
  }
`

const ArtworkCard = styled.TouchableHighlight.attrs(() => ({
  underlayColor: themeGet("colors.white100"),
  activeOpacity: 0.8,
}))``

const tracks = {
  saveOrUnsave: (
    isSaved?: boolean | null,
    internalID?: string,
    slug?: string,
    contextScreenOwnerType: Schema.OwnerEntityTypes | undefined = Schema.OwnerEntityTypes.Artwork
  ) => ({
    action_name: isSaved ? Schema.ActionNames.ArtworkUnsave : Schema.ActionNames.ArtworkSave,
    context_screen_owner_type: contextScreenOwnerType,
    context_module: Schema.ContextModules.ArtworkActions,
    context_screen_owner_id: internalID,
    context_screen_owner_slug: slug,
  }),
}
