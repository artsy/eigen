import { Flex, Image, Text, useColor } from "@artsy/palette-mobile"
import { LegacyArtworkRailCardImage_artwork$key } from "__generated__/LegacyArtworkRailCardImage_artwork.graphql"
import { ARTWORK_RAIL_IMAGE_WIDTH } from "app/Components/ArtworkRail/ArtworkRail"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { sizeToFit } from "app/utils/useSizeToFit"
import { useMemo } from "react"
import { graphql, useFragment } from "react-relay"

export const ARTWORK_RAIL_CARD_IMAGE_HEIGHT = 320
export const ARTWORK_RAIL_CARD_IMAGE_WIDTH = 295

export interface LegacyArtworkRailCardImageProps {
  artwork: LegacyArtworkRailCardImage_artwork$key
  urgencyTag?: string | null
}

export const LegacyArtworkRailCardImage: React.FC<LegacyArtworkRailCardImageProps> = ({
  urgencyTag = null,
  ...restProps
}) => {
  const showBlurhash = useFeatureFlag("ARShowBlurhashImagePlaceholder")

  const color = useColor()

  const { image } = useFragment(artworkFragment, restProps.artwork)
  const { width, height, src } = image?.legacyResized || {}

  const containerWidth = useMemo(() => {
    const imageDimensions = sizeToFit(
      {
        width: image?.legacyResized?.width ?? 0,
        height: image?.legacyResized?.height ?? 0,
      },
      {
        width: ARTWORK_RAIL_CARD_IMAGE_WIDTH,
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
  }, [image?.legacyResized?.height, image?.legacyResized?.width])

  if (!containerWidth) {
    return null
  }

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
    width: ARTWORK_RAIL_CARD_IMAGE_WIDTH,
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
  fragment LegacyArtworkRailCardImage_artwork on Artwork {
    image(includeAll: false) {
      blurhash
      url(version: "large")
      legacyResized: resized(width: 590) {
        src
        srcSet
        width
        height
      }
      aspectRatio
    }
  }
`
